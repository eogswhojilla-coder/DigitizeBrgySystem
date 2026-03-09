<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\BorrowRequest;

class BorrowRequestApprovedNotification extends Notification
{
    use Queueable;

    protected $borrowRequest;
    protected $remarks;

    /**
     * Create a new notification instance.
     */
    public function __construct(BorrowRequest $borrowRequest, $remarks = null)
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
        $location = $this->borrowRequest->inventory->location ?? 'Barangay Office';
        $borrowDate = $this->borrowRequest->borrow_date ? $this->borrowRequest->borrow_date->format('F d, Y') : 'N/A';
        $returnDate = $this->borrowRequest->return_date ? $this->borrowRequest->return_date->format('F d, Y') : 'N/A';
        
        $mail = (new MailMessage)
            ->subject('Borrow Request Approved - Ready to Pick Up!')
            ->greeting('Hello ' . $userName . '!')
            ->line('Great news! Your borrow request has been approved.')
            ->line('**Request Number:** ' . $this->borrowRequest->request_number)
            ->line('**Item:** ' . $itemName)
            ->line('**Quantity:** ' . $this->borrowRequest->quantity)
            ->line('**Borrow Date:** ' . $borrowDate)
            ->line('**Return Date:** ' . $returnDate)
            ->line('')
            ->line('📍 **Pickup Location:** ' . $location)
            ->line('You can now proceed to the location above to pick up your requested equipment.');

        if ($this->remarks) {
            $mail->line('')
                ->line('**Admin Remarks:** ' . $this->remarks);
        }

        $mail->action('View Request Details', url('/resident/inventory-borrow'))
            ->line('Please make sure to return the equipment on or before the return date.')
            ->line('Thank you for using our borrowing system!')
            ->salutation('Regards, Barangay Office');

        return $mail;
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
            'borrow_date' => $this->borrowRequest->borrow_date?->format('Y-m-d'),
            'return_date' => $this->borrowRequest->return_date?->format('Y-m-d'),
            'location' => $this->borrowRequest->inventory->location ?? 'Barangay Office',
            'status' => 'approved',
            'message' => 'Your borrow request has been approved. Item is ready to pick up.',
            'remarks' => $this->remarks,
            'url' => '/resident/inventory-borrow',
            'type' => 'borrow_request',
        ];
    }
}
