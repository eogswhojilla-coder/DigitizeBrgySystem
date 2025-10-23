<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangayResident extends Model
{
    protected $fillable = [


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

            // Other Info Address)
           'municipality',
           'zip',
           'barangay',
           'houseNumber',
           'street',
           'address',
           'contactNumber',
           'emailAddress',

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
          

    ];
}
