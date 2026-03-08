<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateType;
use Illuminate\Http\Request;
use App\Helpers\FileHelper;

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
            'has_fee' => 'required|boolean',
            'fee' => 'nullable|numeric|min:0',
            'gcash_qr' => 'nullable|image|mimes:jpeg,jpg,png|max:2048'
        ]);

        // Convert has_fee string to boolean if needed
        $hasFee = filter_var($validated['has_fee'], FILTER_VALIDATE_BOOLEAN);

        // Handle file upload
        $qrPath = null;
        if ($hasFee && $request->hasFile('gcash_qr')) {
            $qrPath = FileHelper::toBase64($request->file('gcash_qr'));
        }

        // Prepare data for creation
        $data = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'has_fee' => $hasFee,
            'fee' => $hasFee ? ($validated['fee'] ?? null) : null,
            'gcash_qr' => $qrPath,
            'is_active' => true
        ];

        $certificateType = CertificateType::create($data);

        return response()->json($certificateType, 201);
    }

    public function update(Request $request, CertificateType $certificate_type)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:certificate_types,name,' . $certificate_type->id,
            'description' => 'nullable|string',
            'has_fee' => 'required|boolean',
            'fee' => 'nullable|numeric|min:0',
            'gcash_qr' => 'nullable|image|mimes:jpeg,jpg,png|max:2048'
        ]);

        $hasFee = filter_var($validated['has_fee'], FILTER_VALIDATE_BOOLEAN);

        // Handle file upload
        $qrPath = $certificate_type->gcash_qr;
        if ($hasFee && $request->hasFile('gcash_qr')) {
            $qrPath = FileHelper::toBase64($request->file('gcash_qr'));
        }

        // If fee is disabled, clear fee-related fields
        if (!$hasFee) {
            $qrPath = null;
        }

        $certificate_type->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'has_fee' => $hasFee,
            'fee' => $hasFee ? ($validated['fee'] ?? null) : null,
            'gcash_qr' => $qrPath,
        ]);

        return response()->json($certificate_type);
    }
}