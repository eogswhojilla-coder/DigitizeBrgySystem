<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangayResident extends Model
{
    protected $fillable = [
            'residentId',
            'isOfficial',

            // Basic Info
           'position',
           'startDate',
           'endDate',
           'voters',
           'dateOfBirth',
           'placeOfBirth',
           'pwd',
           'singleParent',
           'firstName',
           'middleName',
           'lastName',
           'suffix',
           'gender',
           'civilStatus',
           'religion',
           'nationality',

            // Other Info (Address)
           'municipality',
           'zip',
           'barangay',
           'province',
           'houseNumber',
           'street',
           'purokSitio',
           'subdivision',
           'address',
           'contactNumber',
           'emailAddress',
           
           // Residency Information
           'residencyStatus',
           'residencyStatusOther',
           'dateStartedLiving',
           'permanentAddress',
           'residentType',

            // Guardian
           'fatherName',
           'motherName',
           'guardianName',
           'guardianContact',

            // Account
           'username',
           'password',
           'confirmPassword',

           'image',
           'profileImage',
          

    ];

    /**
     * Get the full URL for the profile image
     */
    public function getProfileImageUrlAttribute()
    {
        if ($this->profileImage) {
            return asset('images/residents/' . $this->profileImage);
        }
        return null;
    }

   
    public function getFullNameAttribute()
    {
        return trim("{$this->firstName} {$this->middleName} {$this->lastName}");
    }

  
    public function user()
    {
        return $this->hasOne(User::class, 'barangay_resident_id');
    }

    
    public function blottersAsRespondent()
    {
        return $this->hasMany(Blotter::class, 'respondent_id');
    }
}
