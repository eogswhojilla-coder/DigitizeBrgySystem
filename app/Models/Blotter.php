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
        'respondent_id', // ID of the resident who is the respondent
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

    // Relationship to BarangayResident for the respondent
    public function respondentResident()
    {
        return $this->belongsTo(BarangayResident::class, 'respondent_id');
    }
}
