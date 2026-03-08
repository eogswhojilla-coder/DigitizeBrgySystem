<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\User;

class NewResidentRegistrationNotification extends Notification
{
    use Queueable;

    protected $registeredUser;

    public function __construct(User $registeredUser)
    {
        $this->registeredUser = $registeredUser;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $name = trim(($this->registeredUser->first_name ?? '') . ' ' . ($this->registeredUser->last_name ?? ''));

        return [
            'user_id' => $this->registeredUser->id,
            'resident_name' => $name,
            'email' => $this->registeredUser->email,
            'title' => 'New Resident Registration',
            'message' => "{$name} has registered and is waiting for account approval.",
            'url' => '/administrator/barangay_residents/account_approval',
            'type' => 'registration',
        ];
    }
}
