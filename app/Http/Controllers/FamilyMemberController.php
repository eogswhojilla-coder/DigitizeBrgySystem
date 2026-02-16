<?php

namespace App\Http\Controllers;

use App\Models\FamilyMember;
use Illuminate\Http\Request;

class FamilyMemberController extends Controller
{
    public function store(Request $request)
    {
        $familyId = $request->input('family_id');
        $members = $request->input('family_members', []);
        
        foreach ($members as $memberData) {
            FamilyMember::create([
                'family_id' => $familyId,
                'residentId' => $memberData['residentId'] ?? null,
                'isExistingResident' => isset($memberData['residentId']) ? 'true' : 'false',
                'newResidentName' => $memberData['newResidentName'] ?? null,
                'relationship' => $memberData['relationship'] ?? null,
                'role' => $memberData['role'] ?? null,
            ]);
        }
        
        return response()->json(['message' => 'Family members created successfully'], 200);
    }
}