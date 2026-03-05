<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Announcement;

class AnnouncementCreatedNotification extends Notification
{
    use Queueable;

    public $announcement;

    public function __construct(Announcement $announcement)
    {
        $this->announcement = $announcement;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        return ['database']; // Send as database notification so residents can see in their account
    }

    /**
     * Get the array representation of the notification for database.
     */
    public function toArray($notifiable)
    {
        return [
            'type' => 'announcement',
            'announcement_id' => $this->announcement->id,
            'title' => $this->announcement->name,
            'message' => 'New announcement: ' . $this->announcement->name,
            'description' => strlen($this->announcement->description) > 100 
                ? substr($this->announcement->description, 0, 100) . '...' 
                : $this->announcement->description,
            'start_at' => $this->announcement->start_at,
            'end_at' => $this->announcement->end_at,
            'created_at' => $this->announcement->created_at,
            'url' => '/resident/announcements', // URL to view the announcement
        ];
    }

    /**
     * Get the mail representation of the notification (optional).
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Barangay Announcement')
            ->greeting('Hello ' . $notifiable->first_name . '!')
            ->line('A new announcement has been posted:')
            ->line('**' . $this->announcement->name . '**')
            ->line($this->announcement->description)
            ->line('**Event Date:** ' . date('F d, Y', strtotime($this->announcement->start_at)))
            ->action('View Announcement', url('/resident/announcements'))
            ->line('Thank you for staying updated!');
    }
}
