<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventories extends Model
{
    protected $fillable = [

 
        'name',
        'description',
        'quantity',
        'condition',
        'location',
        'status',

    ];
}
