<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Helpers\FileHelper;

class CertificateTypeController extends Controller
{
    public function index()
    {
        $types = CertificateType::orderBy('name')->get();
        
        // Add QR URL to response (base64 is already a data URI)
        $types->transform(function ($type) {
            $type->gcash_qr_url = $type->gcash_qr ?: null;
            return $type;
        });
        
        return response()->json($types);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:certificate_types',
            'description' => 'nullable|string',
            'has_fee' => 'nullable|in:0,1,true,false',
            'fee' => 'required_if:has_fee,1,true|nullable|numeric|min:0',
            'gcash_qr' => 'nullable|image|mimes:jpeg,jpg,png|max:2048|required_if:has_fee,1,true',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        
        // Convert has_fee to boolean
        $data['has_fee'] = in_array($request->has_fee, ['1', 1, true, 'true'], true);

        // If has_fee is false, set fee and gcash_qr to null
        if (!$data['has_fee']) {
            $data['fee'] = null;
            $data['gcash_qr'] = null;
        } else {
            // Handle GCash QR upload
            if ($request->hasFile('gcash_qr')) {
                $data['gcash_qr'] = FileHelper::toBase64($request->file('gcash_qr'));
            }
        }

        $type = CertificateType::create($data);
        return response()->json($type, 201);
    }

    public function update(Request $request, CertificateType $certificateType)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:certificate_types,name,' . $certificateType->id,
            'description' => 'nullable|string',
            'has_fee' => 'nullable|in:0,1,true,false',
            'fee' => 'required_if:has_fee,1,true|nullable|numeric|min:0',
            'gcash_qr' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        // Convert has_fee to boolean if present
        if (isset($request->has_fee)) {
            $data['has_fee'] = in_array($request->has_fee, ['1', 1, true, 'true'], true);
        }

        // If has_fee is false, set fee and gcash_qr to null
        if (isset($data['has_fee']) && !$data['has_fee']) {
            $data['fee'] = null;
            $data['gcash_qr'] = null;
        } else if (isset($data['has_fee']) && $data['has_fee']) {
            // Handle GCash QR upload
            if ($request->hasFile('gcash_qr')) {
                $data['gcash_qr'] = FileHelper::toBase64($request->file('gcash_qr'));
            }
        }

        $certificateType->update($data);
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