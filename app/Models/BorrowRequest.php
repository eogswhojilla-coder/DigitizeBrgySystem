<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BorrowRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'inventory_id',
        'request_number',
        'quantity',
        'borrow_date',
        'return_date',
        'actual_return_date',
        'contact_number',
        'purpose',
        'payment_reference',
        'payment_receipt',
        'status',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
        'remarks',
    ];

    protected $casts = [
        'borrow_date' => 'date',
        'return_date' => 'date',
        'actual_return_date' => 'date',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inventory()
    {
        return $this->belongsTo(Inventories::class, 'inventory_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejectedBy()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->request_number = $model->generateRequestNumber();
        });
    }

    public function generateRequestNumber()
    {
        $year = date('Y');
        $month = date('m');
        $day = date('d');
        
        $latest = static::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->whereDay('created_at', $day)
            ->latest()
            ->first();

        $sequence = $latest ? intval(substr($latest->request_number, -5)) + 1 : 1;
        
        return sprintf('BRW-%s%s%s-%05d', $year, $month, $day, $sequence);
    }
}