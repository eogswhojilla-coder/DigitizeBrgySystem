<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\CertificateRequest;

class NewCertificateRequestNotification extends Notification
{
    use Queueable;

    protected $certificateRequest;
    protected $residentName;

    public function __construct(CertificateRequest $certificateRequest, string $residentName)
    {
        $this->certificateRequest = $certificateRequest;
        $this->residentName = $residentName;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'certificate_request_id' => $this->certificateRequest->id,
            'request_number' => $this->certificateRequest->request_number,
            'certificate_type' => $this->certificateRequest->certificateType->name ?? 'Certificate',
            'purpose' => $this->certificateRequest->purpose,
            'resident_name' => $this->residentName,
            'title' => 'New Certificate Request',
            'message' => "{$this->residentName} requested a {$this->certificateRequest->certificateType->name} certificate.",
            'url' => '/administrator/certificate/certificate_pending',
            'type' => 'certificate_request',
        ];
    }
}
