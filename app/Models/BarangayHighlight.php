<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangayHighlight extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'title',
        'description',
        'category',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Scope a query to only include active highlights.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order by the order field.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
