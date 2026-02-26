<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AccountApprovedNotification extends Notification
{
    use Queueable;

    public $user;
    public $adminRemarks;

    public function __construct($user, $adminRemarks = null)
    {
        $this->user = $user;
        $this->adminRemarks = $adminRemarks;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject('Your Account Has Been Approved')
            ->greeting('Hello ' . $this->user->full_name . '!')
            ->line('Good news! Your resident account registration has been approved.')
            ->line('You can now login to the Barangay System using your credentials.');

        if ($this->adminRemarks) {
            $mail->line('**Admin Remarks:** ' . $this->adminRemarks);
        }

        $mail->line('**Username:** ' . $this->user->username)
            ->action('Login Now', url('/login'))
            ->line('Thank you for registering with us!');

        return $mail;
    }
}
