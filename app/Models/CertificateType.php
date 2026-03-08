<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CertificateType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'fee',
        'has_fee',
        'gcash_qr',
        'is_active'
    ];

    protected $casts = [
        'fee' => 'decimal:2',
        'has_fee' => 'boolean',
        'is_active' => 'boolean'
    ];

    protected $appends = [
        'gcash_qr_url'
    ];

    /**
     * Get the full URL for the GCash QR code
     */
    public function getGcashQrUrlAttribute()
    {
        if ($this->gcash_qr) {
            // Base64 data URIs are already complete image sources
            if (str_starts_with($this->gcash_qr, 'data:')) {
                return $this->gcash_qr;
            }
            return asset('images/qrcodes/' . $this->gcash_qr);
        }
        return null;
    }

    public function requests()
    {
        return $this->hasMany(CertificateRequest::class);
    }
}
