<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\BorrowRequest;

class NewBorrowRequestNotification extends Notification
{
    use Queueable;

    protected $borrowRequest;
    protected $residentName;

    public function __construct(BorrowRequest $borrowRequest, string $residentName)
    {
        $this->borrowRequest = $borrowRequest;
        $this->residentName = $residentName;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'borrow_request_id' => $this->borrowRequest->id,
            'request_number' => $this->borrowRequest->request_number,
            'item_name' => $this->borrowRequest->inventory->name ?? 'Item',
            'quantity' => $this->borrowRequest->quantity,
            'resident_name' => $this->residentName,
            'title' => 'New Borrow Request',
            'message' => "{$this->residentName} requested to borrow {$this->borrowRequest->inventory->name}.",
            'url' => '/administrator/inventory/approved_inventory_request',
            'type' => 'borrow_request',
        ];
    }
}
