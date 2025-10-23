<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blotter extends Model
{
    protected $fillable = [

        
        'complainant_resident',
        'complainant_not_resident',
        'complainant_statement',
        'respondent',
        'person_involved_resident',
        'person_involved_not_resident',
        'person_statement',
        'location_of_incident',   
        'date_of_incident',   
        'incident',
        'status',
        'date_reported',
        'remarks',

    ];
}
