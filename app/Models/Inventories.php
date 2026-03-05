<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventories extends Model
{
    protected $fillable = [
        'name',
        'category',           // ✅ Add this
        'description',
        'quantity',
        'condition',
        'location',
        'status',
        'borrowed',           // ✅ Add this
        'damaged',            // ✅ Add this
        'minimum_quantity',   // ✅ Add this
        'has_fee',
        'price',
        'gcash_qr',
    ];

    /**
     * Get all borrow requests for this inventory item
     */
    public function borrowRequests()
    {
        return $this->hasMany(BorrowRequest::class, 'inventory_id');
    }
}
