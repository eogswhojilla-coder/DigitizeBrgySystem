<?php

namespace App\Models;

use App\Enums\CertificateRequestStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CertificateRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'certificate_type_id',
        'request_number',
        'purpose',
        'valid_id_path',
        'source',
        'status',
        'remarks',
        'verified_by',
        'verified_at',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
        'released_by',
        'released_at',
        'is_paid',
        'amount_paid',
        'receipt_path',
        'payment_status',
        'payment_verified_by',
        'payment_verified_at',
        'payment_method'
    ];

    protected $casts = [
        'status' => CertificateRequestStatus::class,
        'payment_status' => PaymentStatus::class,
        'verified_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'released_at' => 'datetime',
        'payment_verified_at' => 'datetime',
        'is_paid' => 'boolean',
        'amount_paid' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function certificateType()
    {
        return $this->belongsTo(CertificateType::class);
    }

    public function certificate()
    {
        return $this->hasOne(Certificate::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejectedBy()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function releasedBy()
    {
        return $this->belongsTo(User::class, 'released_by');
    }

    public function paymentVerifiedBy()
    {
        return $this->belongsTo(User::class, 'payment_verified_by');
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

        $sequence = $latest ? intval(substr($latest->request_number, -5)) + 1 +rand(10,100) : 1 + rand(10,100);
        
        return sprintf('REQ-%s%s%s-%05d', $year, $month, $day, $sequence);
    }
}
