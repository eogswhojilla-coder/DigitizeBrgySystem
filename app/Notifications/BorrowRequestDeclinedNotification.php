<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\BorrowRequest;

class BorrowRequestDeclinedNotification extends Notification
{
    use Queueable;

    protected $borrowRequest;
    protected $remarks;

    /**
     * Create a new notification instance.
     */
    public function __construct(BorrowRequest $borrowRequest, $remarks)
    {
        $this->borrowRequest = $borrowRequest;
        $this->remarks = $remarks;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        $channels = ['database'];
        
        // Add mail channel if user has email and mail is configured
        if (isset($notifiable->email) && $notifiable->email && config('mail.default') !== 'log') {
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
        $itemName = $this->borrowRequest->inventory->name ?? 'Item';
        
        return (new MailMessage)
            ->subject('Borrow Request Declined')
            ->greeting('Hello ' . $userName . '!')
            ->line('We regret to inform you that your borrow request has been declined.')
            ->line('**Request Number:** ' . $this->borrowRequest->request_number)
            ->line('**Item:** ' . $itemName)
            ->line('**Quantity Requested:** ' . $this->borrowRequest->quantity)
            ->line('')
            ->line('**Reason for Decline:**')
            ->line($this->remarks)
            ->line('')
            ->line('If you have any questions or would like to submit a new request, please feel free to contact the barangay office or submit another request through the system.')
            ->action('Submit New Request', url('/resident/inventory-borrow'))
            ->line('Thank you for your understanding.')
            ->salutation('Regards, Barangay Office');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            'borrow_request_id' => $this->borrowRequest->id,
            'request_number' => $this->borrowRequest->request_number,
            'item_name' => $this->borrowRequest->inventory->name ?? 'Item',
            'quantity' => $this->borrowRequest->quantity,
            'status' => 'declined',
            'message' => 'Your borrow request has been declined.',
            'remarks' => $this->remarks,
            'url' => '/resident/inventory-borrow',
            'type' => 'borrow_request',
        ];
    }
}
