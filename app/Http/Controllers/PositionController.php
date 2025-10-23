<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
     public function store(Request $request)
    {
        Position::create($request->all());
        return response()->json(['message' => 'Barangay Position created successfully'], 200);
    }
    public function index()
    {
        $positions = Position::orderBy('id','desc')->paginate(10);
        return response()->json($positions, 200);
    }
      public function destroy(Request $request,$id)
    {
        $positions = Position::find($id);
        $positions->delete();
        return response()->json($positions);
    }
}
