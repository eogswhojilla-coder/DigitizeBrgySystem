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
        'is_active'
    ];

    protected $casts = [
        'fee' => 'decimal:2',
        'has_fee' => 'boolean',
        'is_active' => 'boolean'
    ];

    public function requests()
    {
        return $this->hasMany(CertificateRequest::class);
    }
}
