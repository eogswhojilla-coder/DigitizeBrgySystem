<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CertificateTypeController extends Controller
{
    public function index()
    {
        $types = CertificateType::orderBy('name')->get();
        return response()->json($types);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:certificate_types',
            'description' => 'nullable|string',
            'fee' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $type = CertificateType::create($request->all());
        return response()->json($type, 201);
    }

    public function update(Request $request, CertificateType $certificateType)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:certificate_types,name,' . $certificateType->id,
            'description' => 'nullable|string',
            'fee' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $certificateType->update($request->all());
        return response()->json($certificateType);
    }

    public function destroy(CertificateType $certificateType)
    {
        if ($certificateType->requests()->exists()) {
            return response()->json([
                'message' => 'Cannot delete certificate type with existing requests'
            ], 422);
        }
        
        $certificateType->delete();
        return response()->json(null, 204);
    }
}