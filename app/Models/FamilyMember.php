<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyMember extends Model
{
    protected $fillable = [
        'family_id',
        'residentId',
        'isExistingResident',
        'newResidentName',
        'relationship',
        'role',
        'searchTerm',
    ];

    public function family()
    {
        return $this->belongsTo(Families::class, 'family_id');
    }

    public function resident()
    {
        return $this->belongsTo(BarangayResident::class, 'residentId');
    }
}
