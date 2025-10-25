<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\CertificateRequest;
use App\Models\CertificateType;
use App\Models\User;
use App\Services\CertificateGenerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Enums\CertificateRequestStatus;

class CertificateController extends Controller
{
    protected $generationService;

    public function __construct(CertificateGenerationService $generationService)
    {
        $this->generationService = $generationService;
    }

    public function generateDirect(Request $request)
    {
        try {
            Log::info('Starting certificate generation process');
            
            $validated = $request->validate([
                'certificate_type_id' => 'required|exists:certificate_types,id',
                'resident_name' => 'required|string|max:255',
                'resident_address' => 'required|string|max:255',
                'purpose' => 'required|string'
            ]);
            
            Log::info('Validation passed', $validated);

            $certificateType = CertificateType::findOrFail($validated['certificate_type_id']);
            Log::info('Certificate type found', ['type' => $certificateType->name]);

            // Create a certificate request record
            $certificateRequest = CertificateRequest::create([
                'user_id' => Auth::id(),
                'certificate_type_id' => $certificateType->id,
                'purpose' => $validated['purpose'],
                'status' => CertificateRequestStatus::APPROVED,
            ]);
            Log::info('Certificate request created', ['id' => $certificateRequest->id]);

            // Create the certificate record
            $certificate = Certificate::create([
                'certificate_request_id' => $certificateRequest->id,
                'certificate_number' => 'CERT-' . date('YmdHis'),
                'issued_by' => Auth::id(),
                'issued_at' => now(),
                'valid_until' => now()->addMonths(6),
                'metadata' => [
                    'resident_name' => $validated['resident_name'],
                    'resident_address' => $validated['resident_address']
                ]
            ]);
            Log::info('Certificate record created', ['id' => $certificate->id]);

            try {
                // Generate the PDF
                Log::info('Starting PDF generation');
                $pdfPath = $this->generationService->generatePDF($certificate);
                Log::info('PDF generated successfully', ['path' => $pdfPath]);
                
                // Get the PDF content
                $pdf = Storage::get($pdfPath);
                if (!$pdf) {
                    throw new \Exception('Failed to read generated PDF from storage');
                }
                Log::info('PDF content retrieved successfully');

                return response($pdf, 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="' . $certificateType->name . '.pdf"'
                ]);
            } catch (\Exception $e) {
                Log::error('PDF generation failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Certificate generation failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to generate certificate'], 500);
        }
    }
}