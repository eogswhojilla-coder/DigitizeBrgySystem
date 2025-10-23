<?php

namespace App\Http\Controllers;


use App\Models\Inventories;
use Illuminate\Http\Request;

class InventoriesController extends Controller
{
     public function store(Request $request)
    {
        Inventories::create($request->all());
        return response()->json(['message' => 'New Item created successfully'], 200);
    }
    public function index()
    {
        // $inventories = Inventories::all();
        // return response()->json($inventories);
        $inventories = Inventories::orderBy('id','desc')->paginate(5);
        return response()->json($inventories, 200);
        
    }
    public function update(Request $request,$id)
    {
        $inventories = Inventories::find($id);
        return response()->json($inventories);
    }
    public function destroy(Request $request,$id)
    {
        $inventories = Inventories::find($id);
        $inventories->delete();
        return response()->json($inventories);
    }
}
