<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangayOfficialEndTerm extends Model
{
    protected $fillable = [
        'official_id',
        'position',
        'purok_id',
        'senior',
        'term_from',
        'term_to',
        'pwd',
        'pwd_info',
        'single_parent',
        'status',
        'voters',
        'date_deleted',
    ];
}
