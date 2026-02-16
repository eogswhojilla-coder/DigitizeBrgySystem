<?php

namespace App\Http\Controllers;

use App\Models\Families;
use App\Models\FamilyMember;
use App\Models\Household;
use Illuminate\Http\Request;

class FamiliesController extends Controller
{
    public function index(Request $request)
    {
        $query = Families::with(['household']);

        // Apply filters if needed
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('familyNumber', 'like', '%' . $request->search . '%')
                  ->orWhere('headOfFamily', 'like', '%' . $request->search . '%')
                  ->orWhere('zone', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('zone') && $request->zone != '') {
            $query->where('zone', $request->zone);
        }

        $families = $query->orderBy('id', 'desc')->paginate(10);
        
        // Add member count and member names for each family
        foreach ($families as $family) {
            $members = \DB::table('family_members')
                ->leftJoin('barangay_residents', 'family_members.residentId', '=', 'barangay_residents.id')
                ->where('family_members.family_id', $family->id)
                ->select(
                    'family_members.*',
                    \DB::raw("CONCAT_WS(' ', barangay_residents.firstName, barangay_residents.middleName, barangay_residents.lastName) as residentName")
                )
                ->get();
            
            $family->members = $members;
        }
        
        return response()->json($families, 200);
    }

    public function store(Request $request)
    {
        $family = Families::create($request->all());
        return response()->json([
            'message' => 'New family created successfully',
            'data' => $family
        ], 201);
    }

    public function show($id)
    {
        $family = Families::with(['household'])->findOrFail($id);
        
        // Get members with resident names from barangay_residents
        $members = \DB::table('family_members')
            ->leftJoin('barangay_residents', 'family_members.residentId', '=', 'barangay_residents.id')
            ->where('family_members.family_id', $id)
            ->select(
                'family_members.*',
                \DB::raw("CONCAT_WS(' ', barangay_residents.firstName, barangay_residents.middleName, barangay_residents.lastName) as residentName")
            )
            ->get();
        
        $family->members = $members;
        
        return response()->json($family, 200);
    }

    public function update(Request $request, $id)
    {
        $family = Families::findOrFail($id);
        $family->update($request->all());
        
        return response()->json([
            'message' => 'Family updated successfully',
            'data' => $family
        ], 200);
    }

    public function destroy($id)
    {
        $family = Families::findOrFail($id);
        
        // Delete related records
        FamilyMember::where('family_id', $id)->delete();
        Household::where('familyId', $id)->delete();
        
        $family->delete();
        
        return response()->json([
            'message' => 'Family deleted successfully'
        ], 200);
    }
}
