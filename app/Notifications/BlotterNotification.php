<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Blotter;

class BlotterNotification extends Notification
{
    use Queueable;

    protected $blotter;
    protected $message;

    /**
     * Create a new notification instance.
     */
    public function __construct(Blotter $blotter, $message = null)
    {
        $this->blotter = $blotter;
        $this->message = $message ?? 'You have been named as a respondent in a blotter case.';
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        // Send via database, and optionally mail if email is available
        $channels = ['database'];
        
        // Add mail channel if user has email and mail is configured properly
        $hasEmail = false;
        
        // Check if notifiable has email property (for User models)
        if (isset($notifiable->email) && $notifiable->email) {
            $hasEmail = true;
        }
        
        // Check if it's an anonymous notifiable with mail route
        if (method_exists($notifiable, 'routeNotificationFor')) {
            $mailRoute = $notifiable->routeNotificationFor('mail');
            if ($mailRoute) {
                $hasEmail = true;
            }
        }
        
        if ($hasEmail && config('mail.default') === 'smtp') {
            $channels[] = 'mail';
        }
        
        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $userName = $notifiable->full_name ?? $notifiable->first_name ?? 'Resident';
        $caseNumber = 'BLT-' . str_pad($this->blotter->id, 6, '0', STR_PAD_LEFT);
        
        return (new MailMessage)
            ->subject('Blotter Case Notification - ' . $caseNumber)
            ->greeting('Hello ' . $userName . '!')
            ->line($this->message)
            ->line('**Case Number:** ' . $caseNumber)
            ->line('**Incident Type:** ' . $this->blotter->incident)
            ->line('**Date of Incident:** ' . ($this->blotter->date_of_incident ?? 'Not specified'))
            ->line('**Location:** ' . ($this->blotter->location_of_incident ?? 'Not specified'))
            ->line('**Status:** ' . ucfirst($this->blotter->status ?? 'pending'))
            ->line('Please cooperate with the barangay officials regarding this case. You may contact the barangay office for more information.')
            ->action('View Blotter Notification', url('/resident/blotter-notifications'))
            ->line('Thank you for your cooperation.')
            ->salutation('Regards, ' . (config('app.barangay_name') ?? 'Barangay Office'));
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            'blotter_id' => $this->blotter->id,
            'case_number' => 'BLT-' . str_pad($this->blotter->id, 6, '0', STR_PAD_LEFT),
            'message' => $this->message,
            'incident' => $this->blotter->incident,
            'incident_type' => $this->blotter->incident,
            'date_of_incident' => $this->blotter->date_of_incident,
            'date_reported' => $this->blotter->date_reported,
            'location' => $this->blotter->location_of_incident,
            'status' => $this->blotter->status ?? 'pending',
            'complainant' => $this->blotter->complainant_resident ?? $this->blotter->complainant_not_resident,
            'severity' => $this->calculateSeverity($this->blotter),
        ];
    }

    /**
     * Calculate the severity of the blotter
     */
    private function calculateSeverity($blotter)
    {
        $highSeverityKeywords = ['assault', 'violence', 'threat', 'theft', 'robbery', 'weapon', 'injury'];
        $mediumSeverityKeywords = ['dispute', 'argument', 'noise', 'disturbance'];
        
        $incident = strtolower($blotter->incident ?? '');
        
        foreach ($highSeverityKeywords as $keyword) {
            if (strpos($incident, $keyword) !== false) {
                return 'high';
            }
        }
        
        foreach ($mediumSeverityKeywords as $keyword) {
            if (strpos($incident, $keyword) !== false) {
                return 'medium';
            }
        }
        
        return 'low';
    }
}
