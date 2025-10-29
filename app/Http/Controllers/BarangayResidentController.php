<?php

namespace App\Http\Controllers;

use App\Models\BarangayResident;
use Illuminate\Http\Request;

class BarangayResidentController extends Controller
{
    public function store(Request $request)
    {
        BarangayResident::create($request->all());
        return response()->json(['message' => 'Barangay information created successfully'], 200);
    }
    
    public function index(Request $request)
    {
        $query = BarangayResident::query();

        // Apply filters
        if ($request->has('firstName') && $request->firstName != '') {
            $query->where('firstName', 'like', '%' . $request->firstName . '%');
        }

        if ($request->has('middleName') && $request->middleName != '') {
            $query->where('middleName', 'like', '%' . $request->middleName . '%');
        }

        if ($request->has('lastName') && $request->lastName != '') {
            $query->where('lastName', 'like', '%' . $request->lastName . '%');
        }

        if ($request->has('voters') && $request->voters != '') {
            $query->where('voters', $request->voters);
        }

        if ($request->has('age') && $request->age != '') {
            // Calculate birth year range for age filter
            $currentYear = date('Y');
            $birthYear = $currentYear - $request->age;
            $query->whereYear('dateOfBirth', '>=', $birthYear - 1)
                  ->whereYear('dateOfBirth', '<=', $birthYear + 1);
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        if ($request->has('pwd') && $request->pwd != '') {
            $query->where('pwd', $request->pwd);
        }

        if ($request->has('singleParent') && $request->singleParent != '') {
            $query->where('singleParent', $request->singleParent);
        }

        if ($request->has('residentNumber') && $request->residentNumber != '') {
            $query->where('id', 'like', '%' . $request->residentNumber . '%');
        }

        $barangay_residents = $query->orderBy('id', 'desc')->paginate(10);
        
        return response()->json($barangay_residents, 200);
    }
    
    public function destroy(Request $request, $id)
    {
        $barangay_residents = BarangayResident::find($id);
        $barangay_residents->delete();
        return response()->json($barangay_residents);
    }
}
