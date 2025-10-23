<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AccountCreatedNotification extends Notification
{
    use Queueable;

    public $user;
    public $password; // Optional: include initial password if needed

    public function __construct($user, $password = null)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject('Your Account Has Been Created')
            ->greeting('Hello ' . $this->user->name . '!')
            ->line('An account has been created.')
            ->line('You can log in using your email: **' . $this->user->email . '**');

        if ($this->password) {
            $mail->line('Your temporary password is: **' . $this->password . '**');
        }

        return $mail->action('Login Now', url('/'))
            ->line('Thank you for joining us!');
    }
}
