<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certificate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'certificate_request_id',
        'certificate_number',
        'content',
        'metadata',
        'issued_at',
        'valid_until',
        'issued_by',
        'pdf_path'
    ];

    protected $casts = [
        'metadata' => 'array',
        'issued_at' => 'datetime',
        'valid_until' => 'datetime'
    ];

    public function certificateRequest()
    {
        return $this->belongsTo(CertificateRequest::class);
    }

    public function issuedBy()
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function generateCertificateNumber()
    {
        $year = date('Y');
        $month = date('m');
        $day = date('d');
        
        $latest = static::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->whereDay('created_at', $day)
            ->latest()
            ->first();

        $sequence = $latest ? intval(substr($latest->certificate_number, -5)) + 1 : 1;
        
        return sprintf('CERT-%s%s%s-%05d', $year, $month, $day, $sequence);
    }
}
