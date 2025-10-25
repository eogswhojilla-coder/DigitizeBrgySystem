<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateRequest;
use App\Models\CertificateType;
use App\Enums\CertificateRequestStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        ]);

        $certificateType = CertificateType::findOrFail($request->certificate_type_id);
        
        $certificateRequest = CertificateRequest::create([
            'user_id' => Auth::id(),
            'certificate_type_id' => $request->certificate_type_id,
            'request_number' => (new CertificateRequest)->generateRequestNumber(),
            'purpose' => $request->purpose,
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
}