<?php

namespace App\Services;

use App\Models\Certificate;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Milon\Barcode\Facades\DNS2DFacade as DNS2D;

class CertificateGenerationService
{
    /**
     * Map certificate types to their blade templates
     */
    protected function getCertificateTemplate($certificateTypeName)
    {
        $templateMap = [
            'Barangay Clearance' => 'certificates.clearance',
            'Certificate of Residency' => 'certificates.residency',
            'Certificate of Indigency' => 'certificates.indigency',
            'Business Permit' => 'certificates.business',
            // Add more mappings as needed
        ];

        // Return specific template if exists, otherwise use generic template
        return $templateMap[$certificateTypeName] ?? 'certificates.template';
    }

    public function generatePDF(Certificate $certificate)
    {
        try {
            // Increase execution time and memory for PDF generation
            set_time_limit(120);
            ini_set('memory_limit', '256M');
            
            Log::info('Loading certificate relationships');
            // Load necessary relationships
            $certificate->load(['certificateRequest.certificateType', 'issuedBy']);
            
            Log::info('Preparing PDF data', [
                'certificate_id' => $certificate->id,
                'type' => $certificate->certificateRequest->certificateType->name ?? 'N/A'
            ]);

            // Use metadata for resident data (for direct generation)
            $residentData = [
                'full_name' => $certificate->metadata['resident_name'] ?? 'N/A',
                'address' => $certificate->metadata['resident_address'] ?? 'N/A',
                'age' => $certificate->metadata['age'] ?? 'N/A',
                'civil_status' => $certificate->metadata['civil_status'] ?? 'Single',
            ];

            // Get the appropriate template based on certificate type
            $certificateTypeName = $certificate->certificateRequest->certificateType->name ?? 'Default';
            $templateName = $this->getCertificateTemplate($certificateTypeName);

            Log::info('Loading PDF view', ['template' => $templateName]);
            
            // Generate QR Code with verification data
            $qrData = json_encode([
                'certificate_number' => $certificate->certificate_number,
                'request_id' => $certificate->certificate_request_id,
                'issued_date' => $certificate->issued_at ? $certificate->issued_at->format('Y-m-d') : now()->format('Y-m-d'),
                'resident_name' => $residentData['full_name'],
                'certificate_type' => $certificateTypeName,
                'amount_paid' => $certificate->certificateRequest->amount_paid ?? 0,
                'payment_status' => $certificate->certificateRequest->payment_status ?? 'N/A',
                'verify_url' => url('/verify-certificate/' . $certificate->certificate_number)
            ]);
            
            // Generate QR code as base64 image (PNG format, size: medium)
            $qrCodeImage = DNS2D::getBarcodePNG($qrData, 'QRCODE', 4, 4);
            
            // Prepare data for the view
            $viewData = [
                'certificate' => $certificate,
                'resident' => (object)$residentData,
                'type' => $certificate->certificateRequest->certificateType,
                'issuedBy' => $certificate->issuedBy,
                'purpose' => $certificate->certificateRequest->purpose ?? 'General Purpose',
                'metadata' => $certificate->metadata,
                // Additional fields for clearance template
                'residentName' => $residentData['full_name'],
                'residentAge' => $residentData['age'],
                'residentCivilStatus' => $residentData['civil_status'],
                'residentAddress' => $residentData['address'],
                'date' => now()->format('jS \d\a\y \o\f F, Y'),
                'punongBarangay' => 'HON. FRANCIS R. EUSEBIO',
                'barangayId' => $certificate->certificate_number,
                'ctcDateIssued' => now()->format('Y-m-d'),
                'ctcAmountPaid' => number_format($certificate->certificateRequest->amount_paid ?? 0, 2),
                'ctcIssuedAt' => 'BRGY. II',
                'qrCodeImage' => $qrCodeImage, // Base64 encoded QR code
            ];

            Log::info('Creating PDF from template', ['template' => $templateName]);
            $pdf = PDF::loadView($templateName, $viewData);

            Log::info('Setting PDF options');
            // Set PDF options - optimized for faster generation
            $pdf->setPaper('A4', 'portrait');
            $pdf->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => false, // Disable remote loading for speed
                'defaultFont' => 'DejaVu Sans',
                'chroot' => public_path(), // Allow local file access only
                'enable_php' => false,
                'debugKeepTemp' => false,
            ]);

            Log::info('Rendering PDF');
            
            // Generate PDF output
            $pdfContent = $pdf->output();
            
            Log::info('Saving PDF to storage');
            // Save PDF to storage
            $fileName = 'certificate_' . $certificate->certificate_number . '.pdf';
            $path = 'certificates/' . $fileName;
            Storage::put($path, $pdfContent);

            Log::info('Updating certificate record with PDF path');
            // Update certificate with PDF path
            $certificate->update(['pdf_path' => $path]);

            Log::info('PDF generation completed successfully');
            return $path;
            
        } catch (\Exception $e) {
            Log::error('PDF generation failed', [
                'certificate_id' => $certificate->id ?? 'unknown',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Re-throw with more context
            throw new \Exception('Certificate generation failed: ' . $e->getMessage(), 0, $e);
        }
    }
}