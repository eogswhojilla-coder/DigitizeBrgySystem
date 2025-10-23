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
    public function index()
    {
        $barangay_residents = BarangayResident::orderBy('id','desc')->paginate(5);
        return response()->json($barangay_residents, 200);
    }
    public function destroy(Request $request, $id)
    {
        $barangay_residents = BarangayResident::find($id);
        $barangay_residents->delete();
        return response()->json($barangay_residents);
    }
}
