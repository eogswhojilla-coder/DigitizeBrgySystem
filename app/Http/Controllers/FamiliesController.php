<?php

namespace App\Http\Controllers;


use App\Models\Families;
use Illuminate\Http\Request;

class FamiliesController extends Controller
{
     public function store(Request $request)
    {
        Families::create($request->all());
        return response()->json(['message' => 'New familiy created successfully'], 200);
    }
}
