<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventories extends Model
{
    protected $fillable = [
        'name',
        'category',
        'description',
        'quantity',
        'condition',
        'location',
        'status',
        'borrowed',
        'damaged',
        'minimum_quantity',
        'has_fee',
        'price',
        'gcash_qr',
        'image',
    ];

    /**
     * Get all borrow requests for this inventory item
     */
    public function borrowRequests()
    {
        return $this->hasMany(BorrowRequest::class, 'inventory_id');
    }
}
