<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CertificateRequest;
use App\Enums\CertificateRequestStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CertificateRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = CertificateRequest::with(['user', 'certificateType'])
            ->latest();

        // Filter by status if provided
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $requests = $query->paginate(10);
        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'certificate_type_id' => 'required|exists:certificate_types,id',
            'purpose' => 'required|string',
            'source' => 'required|in:ONLINE,WALKIN'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $certificateRequest = new CertificateRequest($request->all());
        $certificateRequest->user_id = Auth::id();
        $certificateRequest->request_number = $certificateRequest->generateRequestNumber();
        $certificateRequest->status = $request->source === 'WALKIN' 
            ? CertificateRequestStatus::VERIFIED 
            : CertificateRequestStatus::PENDING_VERIFICATION;
        
        $certificateRequest->save();

        return response()->json($certificateRequest->load('certificateType'), 201);
    }

    public function verify(CertificateRequest $certificateRequest)
    {
        if ($certificateRequest->status !== CertificateRequestStatus::PENDING_VERIFICATION) {
            return response()->json(['message' => 'Request cannot be verified'], 422);
        }

        $certificateRequest->update([
            'status' => CertificateRequestStatus::VERIFIED,
            'verified_by' => Auth::id(),
            'verified_at' => now()
        ]);

        return response()->json($certificateRequest);
    }

    public function approve(CertificateRequest $certificateRequest)
    {
        if ($certificateRequest->status !== CertificateRequestStatus::VERIFIED) {
            return response()->json(['message' => 'Request cannot be approved'], 422);
        }

        $certificateRequest->update([
            'status' => CertificateRequestStatus::APPROVED,
            'approved_by' => Auth::id(),
            'approved_at' => now()
        ]);

        // Generate certificate here
        // TODO: Add certificate generation logic

        return response()->json($certificateRequest);
    }

    public function reject(CertificateRequest $certificateRequest, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'remarks' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $certificateRequest->update([
            'status' => CertificateRequestStatus::REJECTED,
            'rejected_by' => Auth::id(),
            'rejected_at' => now(),
            'remarks' => $request->remarks
        ]);

        return response()->json($certificateRequest);
    }

    public function release(CertificateRequest $certificateRequest)
    {
        if ($certificateRequest->status !== CertificateRequestStatus::FOR_RELEASE) {
            return response()->json(['message' => 'Request is not ready for release'], 422);
        }

        $certificateRequest->update([
            'status' => CertificateRequestStatus::RELEASED,
            'released_by' => Auth::id(),
            'released_at' => now()
        ]);

        return response()->json($certificateRequest);
    }
}
