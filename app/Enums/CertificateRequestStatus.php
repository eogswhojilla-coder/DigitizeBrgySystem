<?php

namespace App\Enums;

enum CertificateRequestStatus: string
{
    case PENDING_VERIFICATION = 'PENDING_VERIFICATION';
    case VERIFIED = 'VERIFIED';
    case APPROVED = 'APPROVED';
    case REJECTED = 'REJECTED';
    case FOR_RELEASE = 'FOR_RELEASE';
    case RELEASED = 'RELEASED';

    public function label(): string
    {
        return match($this) {
            self::PENDING_VERIFICATION => 'Pending Verification',
            self::VERIFIED => 'Verified',
            self::APPROVED => 'Approved',
            self::REJECTED => 'Rejected',
            self::FOR_RELEASE => 'For Release',
            self::RELEASED => 'Released',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING_VERIFICATION => 'yellow',
            self::VERIFIED => 'blue',
            self::APPROVED => 'green',
            self::REJECTED => 'red',
            self::FOR_RELEASE => 'purple',
            self::RELEASED => 'gray',
        };
    }
}