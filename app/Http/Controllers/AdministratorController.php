<?php

namespace App\Http\Controllers;

use App\Models\Administrator;
use Illuminate\Http\Request;

class AdministratorController extends Controller
{
    public function store(Request $request)
    {
        Administrator::create($request->all());
        return response()->json(['message' => 'New administrator created successfully'], 200);
    }
    public function index()
    {
        $administrators = Administrator::orderBy('id', 'desc')->paginate(10);
        return response()->json($administrators, 200);
    }
    public function destroy(Request $request, $id)
    {
        $administrators = Administrator::find($id);
        $administrators->delete();
        return response()->json($administrators);
    }
}

