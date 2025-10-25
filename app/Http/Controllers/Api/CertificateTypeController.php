<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateType;
use Illuminate\Http\Request;

class CertificateTypeController extends Controller
{
    public function index()
    {
        $certificateTypes = CertificateType::orderBy('name')->get();
        return response()->json($certificateTypes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:certificate_types',
            'description' => 'nullable|string',
            'fee' => 'required|numeric|min:0'
        ]);

        $certificateType = CertificateType::create($validated);

        return response()->json($certificateType, 201);
    }
}