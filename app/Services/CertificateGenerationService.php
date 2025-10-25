<?php

namespace App\Services;

use App\Models\Certificate;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CertificateGenerationService
{
    public function generatePDF(Certificate $certificate)
    {
        try {
            Log::info('Loading certificate relationships');
            // Load all necessary relationships
            $certificate->load(['certificateRequest.user.resident', 'certificateRequest.certificateType', 'issuedBy']);
            
            Log::info('Preparing PDF data', [
                'certificate_id' => $certificate->id,
                'resident' => $certificate->certificateRequest->user->resident->full_name ?? 'N/A',
                'type' => $certificate->certificateRequest->certificateType->name ?? 'N/A'
            ]);

            // Determine resident data source
            $user = $certificate->certificateRequest->user;
            $resident = $user->resident;

            $residentData = $resident ? [
                'full_name' => $resident->full_name,
                'address' => $resident->address,
                'age' => $resident->age,
                'civil_status' => $resident->civil_status,
            ] : [
                'full_name' => $certificate->metadata['resident_name'] ?? $user->full_name,
                'address' => $certificate->metadata['resident_address'] ?? 'N/A',
                'age' => $certificate->metadata['age'] ?? 'N/A',
                'civil_status' => $certificate->metadata['civil_status'] ?? 'N/A',
            ];

            Log::info('Loading PDF view');
            $pdf = PDF::loadView('certificates.template', [
                'certificate' => $certificate,
                'resident' => (object)$residentData,
                'type' => $certificate->certificateRequest->certificateType,
                'issuedBy' => $certificate->issuedBy,
                'purpose' => $certificate->certificateRequest->purpose,
                'metadata' => $certificate->metadata,
            ]);

            Log::info('Setting PDF options');
            // Set PDF options
            $pdf->setPaper('A4', 'portrait');
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'DejaVu Sans',
                'enable_php' => true,
                'enable_javascript' => true,
                'dpi' => 150,
                'debugPng' => true,
                'debugKeepTemp' => true,
                'logOutputFile' => storage_path('logs/pdf.log')
            ]);

            Log::info('Saving PDF to storage');
            // Save PDF to storage
            $fileName = 'certificate_' . $certificate->certificate_number . '.pdf';
            $path = 'certificates/' . $fileName;
            Storage::put($path, $pdf->output());

            Log::info('Updating certificate record with PDF path');
            // Update certificate with PDF path
            $certificate->update(['pdf_path' => $path]);

            Log::info('PDF generation completed successfully');
            return $path;
            
        } catch (\Exception $e) {
            Log::error('PDF generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}