<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

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
            $file = $request->file('gcash_qr');
            $filename = time() . '_' . $file->getClientOriginalName();
            
            // Create directory if it doesn't exist
            $qrDirectory = public_path('images/qrcodes');
            if (!File::exists($qrDirectory)) {
                File::makeDirectory($qrDirectory, 0755, true);
            }
            
            $file->move($qrDirectory, $filename);
            $qrPath = $filename;
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
}