<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdministratorController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:8',
            'contactNumber' => 'nullable|string|max:20',
        ]);

        User::create([
            'first_name' => $validated['firstName'],
            'middle_name' => $validated['middleName'] ?? null,
            'last_name' => $validated['lastName'],
            'username' => $validated['username'],
            'email' => $validated['username'], // Use username as email
            'password' => Hash::make($validated['password']),
            'contact' => $validated['contactNumber'] ?? null,
            'user_type' => 'admin',
            'status' => 'approved',
        ]);

        return response()->json(['message' => 'New administrator created successfully'], 200);
    }

    public function index()
    {
        $administrators = User::where('user_type', 'admin')
            ->orderBy('id', 'desc')
            ->paginate(10);
        return response()->json($administrators, 200);
    }

    public function destroy(Request $request, $id)
    {
        $administrator = User::where('user_type', 'admin')->findOrFail($id);
        $administrator->delete();
        return response()->json($administrator);
    }
}

