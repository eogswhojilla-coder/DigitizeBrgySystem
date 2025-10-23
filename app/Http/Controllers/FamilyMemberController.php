<?php

namespace App\Http\Controllers;

use App\Models\FamilyMember;
use Illuminate\Http\Request;

class FamilyMemberController extends Controller
{
    public function store(Request $request)
    {
        FamilyMember::create($request->all());
        return response()->json(['message' => 'New family member created successfully'], 200);
    }
}
