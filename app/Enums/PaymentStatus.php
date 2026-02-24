<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case UNPAID = 'UNPAID';
    case FOR_VERIFICATION = 'FOR_VERIFICATION';
    case VERIFIED = 'VERIFIED';
    case PAYMENT_REJECTED = 'PAYMENT_REJECTED';
}
