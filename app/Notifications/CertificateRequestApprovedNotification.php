<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\CertificateRequest;

class CertificateRequestApprovedNotification extends Notification
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
            ->subject('Certificate Request Approved - ' . $certType)
            ->greeting('Hello ' . $userName . '!')
            ->line('Great news! Your certificate request has been approved.')
            ->line('**Request Number:** ' . $this->certificateRequest->request_number)
            ->line('**Certificate Type:** ' . $certType)
            ->line('**Purpose:** ' . $this->certificateRequest->purpose)
            ->line('')
            ->line('Your certificate is now being prepared for release. You will be notified once it is ready for pickup at the Barangay Hall.');

        if ($this->certificateRequest->remarks) {
            $mail->line('')
                ->line('**Remarks:** ' . $this->certificateRequest->remarks);
        }

        $mail->action('View My Requests', url('/resident/certificates'))
            ->line('Thank you for using our online certificate request system!')
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
            'status' => 'approved',
            'message' => 'Your certificate request has been approved and is being prepared for release.',
            'url' => '/resident/certificate-request?tab=history',
            'type' => 'certificate_request',
        ];
    }
}
