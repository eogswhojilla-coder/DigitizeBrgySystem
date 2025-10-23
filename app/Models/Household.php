<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Household extends Model
{
    // Table name (optional if Laravel can guess it)
    protected $table = 'households';

    // Mass assignable fields
    protected $fillable = [
        'familyId',
        'incomeType',
        'incomeBracket',
        'numericIncome',
        'houseType',
        'numberOfRooms',
        'electricity',
        'water',
        'internet',
        'cable',
        'landline',
        'toiletType',
        'wasteDisposal',
        'notes',
    ];
}
