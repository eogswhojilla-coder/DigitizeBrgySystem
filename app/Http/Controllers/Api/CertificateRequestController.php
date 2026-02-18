<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateRequest;
use App\Models\CertificateType;
use App\Models\Certificate;
use App\Enums\CertificateRequestStatus;
use App\Services\CertificateGenerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CertificateRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = CertificateRequest::with(['user', 'certificateType', 'verifiedBy', 'approvedBy', 'rejectedBy', 'releasedBy'])
            ->latest();

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range if provided
        if ($request->has('from_date') && $request->has('to_date')) {
            $query->whereBetween('created_at', [
                Carbon::parse($request->from_date)->startOfDay(),
                Carbon::parse($request->to_date)->endOfDay()
            ]);
        }

        $requests = $query->paginate(10);
        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $request->validate([
            'certificate_type_id' => 'required|exists:certificate_types,id',
            'purpose' => 'required|string|max:500',
            'valid_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB max
        ]);

        // Store the valid ID
        $validIdPath = null;
        if ($request->hasFile('valid_id')) {
            $validIdPath = $request->file('valid_id')->store('certificate_ids', 'public');
        }

        $certificateType = CertificateType::findOrFail($request->certificate_type_id);
        
        $certificateRequest = CertificateRequest::create([
            'user_id' => Auth::id(),
            'certificate_type_id' => $request->certificate_type_id,
            'request_number' => (new CertificateRequest)->generateRequestNumber(),
            'purpose' => $request->purpose,
            'valid_id_path' => $validIdPath,
            'source' => $request->source ?? 'web',
            'status' => CertificateRequestStatus::PENDING_VERIFICATION,
        ]);

        return response()->json([
            'message' => 'Certificate request submitted successfully',
            'request' => $certificateRequest->load(['user', 'certificateType'])
        ], 201);
    }

    public function show(CertificateRequest $certificateRequest)
    {
        $certificateRequest->load([
            'user', 
            'certificateType', 
            'verifiedBy', 
            'approvedBy', 
            'rejectedBy', 
            'releasedBy',
            'certificate'
        ]);

        return response()->json($certificateRequest);
    }

    public function verify(CertificateRequest $certificateRequest)
    {
        if ($certificateRequest->status !== CertificateRequestStatus::PENDING_VERIFICATION) {
            return response()->json([
                'message' => 'Request cannot be verified in its current status'
            ], 422);
        }

        $certificateRequest->update([
            'status' => CertificateRequestStatus::VERIFIED,
            'verified_by' => Auth::id(),
            'verified_at' => now()
        ]);

        return response()->json([
            'message' => 'Request verified successfully',
            'request' => $certificateRequest->fresh(['user', 'certificateType', 'verifiedBy'])
        ]);
    }

    public function approve(Request $request, CertificateRequest $certificateRequest)
    {
        if ($certificateRequest->status !== CertificateRequestStatus::VERIFIED) {
            return response()->json([
                'message' => 'Request cannot be approved in its current status'
            ], 422);
        }

        $certificateRequest->update([
            'status' => CertificateRequestStatus::APPROVED,
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'remarks' => $request->remarks
        ]);

        return response()->json([
            'message' => 'Request approved successfully',
            'request' => $certificateRequest->fresh(['user', 'certificateType', 'approvedBy'])
        ]);
    }

    public function reject(Request $request, CertificateRequest $certificateRequest)
    {
        $request->validate([
            'remarks' => 'required|string|max:500'
        ]);

        if (!in_array($certificateRequest->status, [CertificateRequestStatus::PENDING_VERIFICATION, CertificateRequestStatus::VERIFIED])) {
            return response()->json([
                'message' => 'Request cannot be rejected in its current status'
            ], 422);
        }

        $certificateRequest->update([
            'status' => CertificateRequestStatus::REJECTED,
            'rejected_by' => Auth::id(),
            'rejected_at' => now(),
            'remarks' => $request->remarks
        ]);

        return response()->json([
            'message' => 'Request rejected successfully',
            'request' => $certificateRequest->fresh(['user', 'certificateType', 'rejectedBy'])
        ]);
    }

    public function updatePayment(Request $request, CertificateRequest $certificateRequest)
    {
        $request->validate([
            'amount_paid' => 'required|numeric|min:0'
        ]);

        $certificateRequest->update([
            'is_paid' => true,
            'amount_paid' => $request->amount_paid
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'request' => $certificateRequest->fresh()
        ]);
    }

    public function printCertificate(CertificateRequest $certificateRequest, CertificateGenerationService $generationService)
    {
        // Check if request is approved
        if (!in_array($certificateRequest->status, [CertificateRequestStatus::APPROVED, CertificateRequestStatus::FOR_RELEASE, CertificateRequestStatus::RELEASED])) {
            return response()->json([
                'message' => 'Certificate can only be printed for approved requests'
            ], 422);
        }

        try {
            // Load necessary relationships
            $certificateRequest->load(['user', 'certificateType']);

            // Check if certificate already exists
            $certificate = $certificateRequest->certificate;
            
            if (!$certificate) {
                // Create new certificate
                $certificate = Certificate::create([
                    'certificate_request_id' => $certificateRequest->id,
                    'certificate_number' => (new Certificate)->generateCertificateNumber(),
                    'issued_by' => Auth::id(),
                    'issued_at' => now(),
                    'valid_until' => now()->addMonths(6),
                    'metadata' => [
                        'resident_name' => $certificateRequest->user->first_name 
                            ? trim($certificateRequest->user->first_name . ' ' . ($certificateRequest->user->middle_name ?? '') . ' ' . ($certificateRequest->user->last_name ?? ''))
                            : $certificateRequest->user->name,
                        'resident_address' => $certificateRequest->user->address ?? 'N/A',
                        'age' => $certificateRequest->user->age ?? 'N/A',
                        'civil_status' => $certificateRequest->user->civil_status ?? 'N/A',
                        'purpose' => $certificateRequest->purpose,
                    ]
                ]);

                // Update request status to RELEASED if not already
                if ($certificateRequest->status !== CertificateRequestStatus::RELEASED) {
                    $certificateRequest->update([
                        'status' => CertificateRequestStatus::RELEASED,
                        'released_by' => Auth::id(),
                        'released_at' => now()
                    ]);
                }
            }

            // Generate or retrieve PDF
            $pdfPath = $certificate->pdf_path;
            
            if (!$pdfPath || !Storage::exists($pdfPath)) {
                $pdfPath = $generationService->generatePDF($certificate);
            }

            // Get the PDF content
            $pdf = Storage::get($pdfPath);
            
            if (!$pdf) {
                throw new \Exception('Failed to read PDF from storage');
            }

            return response($pdf, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="certificate_' . $certificate->certificate_number . '.pdf"'
            ]);

        } catch (\Exception $e) {
            Log::error('Certificate print failed', [
                'request_id' => $certificateRequest->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Failed to generate certificate: ' . $e->getMessage()
            ], 500);
        }
    }
}