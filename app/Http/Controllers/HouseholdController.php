<?php

namespace App\Http\Controllers;

use App\Models\Household;
use Illuminate\Http\Request;

class HouseholdController extends Controller
{
    public function store(Request $request)
    {
        Household::create($request->all());
        return response()->json(['message' => 'New household created successfully'], 200);
    }
}
