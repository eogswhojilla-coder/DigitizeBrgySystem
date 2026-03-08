<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\CertificateRequest;

class CertificateRequestRejectedNotification extends Notification
{
    use Queueable;

    protected $certificateRequest;

    public function __construct(CertificateRequest $certificateRequest)
    {
        $this->certificateRequest = $certificateRequest;
    }

    public function via($notifiable): array
    {
        $channels = ['database'];

        if (isset($notifiable->email) && $notifiable->email && config('mail.default') !== 'log') {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toMail($notifiable): MailMessage
    {
        $userName = $notifiable->full_name ?? $notifiable->first_name ?? 'Resident';
        $certType = $this->certificateRequest->certificateType->name ?? 'Certificate';

        $mail = (new MailMessage)
            ->subject('Certificate Request Rejected - ' . $certType)
            ->greeting('Hello ' . $userName . ',')
            ->line('We regret to inform you that your certificate request has been rejected.')
            ->line('**Request Number:** ' . $this->certificateRequest->request_number)
            ->line('**Certificate Type:** ' . $certType)
            ->line('**Purpose:** ' . $this->certificateRequest->purpose);

        if ($this->certificateRequest->remarks) {
            $mail->line('')
                ->line('**Reason for Rejection:** ' . $this->certificateRequest->remarks);
        }

        $mail->line('')
            ->line('If you believe this was a mistake or need further assistance, please visit the Barangay Hall or submit a new request.')
            ->action('Submit New Request', url('/resident/certificates'))
            ->line('Thank you for your understanding.')
            ->salutation('Regards, Barangay Office');

        return $mail;
    }

    public function toArray($notifiable): array
    {
        return [
            'certificate_request_id' => $this->certificateRequest->id,
            'request_number' => $this->certificateRequest->request_number,
            'certificate_type' => $this->certificateRequest->certificateType->name ?? 'Certificate',
            'purpose' => $this->certificateRequest->purpose,
            'status' => 'rejected',
            'remarks' => $this->certificateRequest->remarks,
            'message' => 'Your certificate request has been rejected.',
            'url' => '/resident/certificates',
            'type' => 'certificate',
        ];
    }
}
