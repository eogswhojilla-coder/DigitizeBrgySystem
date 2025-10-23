<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use Illuminate\Http\Request;

class BlotterController extends Controller
{
    public function store(Request $request)
    {
        Blotter::create($request->all());
        return response()->json(['message' => 'Barangay information created successfully'], 200);
    }
    public function index()
    {
        $blotters = Blotter::orderBy('id','desc')->paginate(10);
        return response()->json($blotters, 200);
    }
      public function destroy(Request $request,$id)
    {
        $blotters = Blotter::find($id);
        $blotters->delete();
        return response()->json($blotters);
    }
}
