<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BorrowRequest;
use App\Models\CertificateRequest;
use App\Models\CertificateType;
use App\Models\Blotter;
use App\Models\Inventories;
use App\Enums\CertificateRequestStatus;
use App\Enums\PaymentStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ResidentController extends Controller
{
    // Get all residents from list_of_resident
    public function getAllResidents()
    {
        try {
            $residents = DB::table('list_of_resident')
                ->select('id', 'first_name', 'middle_name', 'last_name', 'purok', 'age', 'sex')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $residents
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching residents: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error fetching residents',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Certificate Types
    public function getCertificateTypes()
    {
        $types = CertificateType::orderBy('name')->get();
        
        return response()->json([
            'success' => true,
            'data' => $types
        ]);
    }

    // My Certificate Requests
    public function getMyCertificateRequests()
    {
        $requests = CertificateRequest::with(['certificateType', 'user'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    // Submit Certificate Request
    public function submitCertificateRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'certificate_type_id' => 'required|exists:certificate_types,id',
            'purpose' => 'required|string|max:500',
            'valid_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048', // 2MB max
            'payment_receipt' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get certificate type to check if it has a fee
            $certificateType = CertificateType::findOrFail($request->certificate_type_id);
            
            // Store the valid ID
            $validIdPath = null;
            if ($request->hasFile('valid_id')) {
                $validIdPath = $request->file('valid_id')->store('certificate_ids', 'public');
            }

            // Handle payment receipt upload if certificate has fee
            $receiptPath = null;
            $paymentStatus = PaymentStatus::UNPAID;
            $isPaid = false;
            $amountPaid = 0;

            if ($certificateType->has_fee && $certificateType->fee > 0) {
                if ($request->hasFile('payment_receipt')) {
                    $receiptPath = $request->file('payment_receipt')->store('receipts', 'public');
                    $paymentStatus = PaymentStatus::FOR_VERIFICATION;
                    $isPaid = true;
                    $amountPaid = $certificateType->fee;
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Payment receipt is required for certificates with fees',
                        'errors' => ['payment_receipt' => ['Payment receipt is required']]
                    ], 422);
                }
            } else {
                // No fee required, mark as verified payment
                $paymentStatus = PaymentStatus::VERIFIED;
            }

            $certificateRequest = CertificateRequest::create([
                'user_id' => Auth::id(),
                'certificate_type_id' => $request->certificate_type_id,
                'purpose' => $request->purpose,
                'valid_id_path' => $validIdPath,
                'receipt_path' => $receiptPath,
                'payment_status' => $paymentStatus,
                'payment_method' => $certificateType->has_fee ? 'GCash' : null,
                'is_paid' => $isPaid,
                'amount_paid' => $amountPaid,
                'status' => CertificateRequestStatus::PENDING_VERIFICATION,
                'source' => 'ONLINE',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Certificate request submitted successfully',
                'data' => $certificateRequest->load('certificateType')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit certificate request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get Available Inventories (use existing from inventories API)
    public function getAvailableInventories()
    {
        $inventories = Inventories::where('status', 'Active')
            ->where('quantity', '>', 0)
            ->get()
            ->map(function ($item) {
                $item->available = $item->quantity - ($item->borrowed ?? 0);
                return $item;
            })
            ->filter(function ($item) {
                return $item->available > 0;
            });
        
        return response()->json([
            'success' => true,
            'data' => $inventories->values()
        ]);
    }

    // My Borrow Requests
    public function getMyBorrowRequests()
    {
        // Check if BorrowRequest model exists
        if (!class_exists(BorrowRequest::class)) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        $requests = BorrowRequest::with(['inventory', 'user'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    // Submit Borrow Request
    public function submitBorrowRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'inventory_id' => 'required|exists:inventories,id',
            'quantity' => 'required|integer|min:1',
            'borrow_date' => 'required|date|after_or_equal:today',
            'return_date' => 'required|date|after:borrow_date',
            'contact_number' => 'required|regex:/^09\d{9}$/',
            'purpose' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if inventory has enough quantity
            $inventory = Inventories::findOrFail($request->inventory_id);
            $available = $inventory->quantity - ($inventory->borrowed ?? 0);

            if ($available < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Only {$available} items available"
                ], 422);
            }

            $borrowRequest = BorrowRequest::create([
                'user_id' => Auth::id(),
                'inventory_id' => $request->inventory_id,
                'quantity' => $request->quantity,
                'borrow_date' => $request->borrow_date,
                'return_date' => $request->return_date,
                'contact_number' => $request->contact_number,
                'purpose' => $request->purpose,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Borrow request submitted successfully',
                'data' => $borrowRequest->load('inventory')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit borrow request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // My Blotter Notifications
    public function getMyBlotterNotifications()
    {
        $user = Auth::user();
        
        // Find the resident associated with this user
        $resident = \App\Models\BarangayResident::where('username', $user->username)->first();
        
        if (!$resident) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }
        
        // Get blotters where user is the respondent
        $blotters = Blotter::where('respondent_id', $resident->id)
            ->with('respondentResident')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($blotter) {
                return [
                    'id' => $blotter->id,
                    'case_number' => 'BLT-' . str_pad($blotter->id, 6, '0', STR_PAD_LEFT),
                    'complainant_name' => $blotter->complainant_resident ?? $blotter->complainant_not_resident,
                    'respondent_name' => $blotter->respondent,
                    'incident_type' => $blotter->incident,
                    'incident_date' => $blotter->date_of_incident,
                    'incident_details' => $blotter->complainant_statement,
                    'description' => $blotter->complainant_statement,
                    'location' => $blotter->location_of_incident,
                    'status' => $blotter->status ?? 'pending',
                    'severity' => $this->calculateSeverity($blotter),
                    'action_taken' => $blotter->remarks,
                    'notes' => $blotter->remarks,
                    'created_at' => $blotter->created_at,
                    'updated_at' => $blotter->updated_at,
                ];
            });
        
        return response()->json([
            'success' => true,
            'data' => $blotters
        ]);
    }

    // Get My Profile
    public function getMyProfile()
    {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    // Update My Profile
    public function updateMyProfile(Request $request)
    {
        $user = Auth::user();
        
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'contact' => 'sometimes|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update($request->only(['first_name', 'middle_name', 'last_name', 'email', 'contact']));

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getResidentName($residentId)
    {
        if (!$residentId) return null;
        
        $resident = \App\Models\BarangayResident::find($residentId);
        if (!$resident) return null;
        
        return trim("{$resident->firstname} {$resident->middlename} {$resident->lastname}");
    }

    private function calculateSeverity($blotter)
    {
        $highSeverityKeywords = ['assault', 'violence', 'threat', 'theft', 'robbery'];
        $incident = strtolower($blotter->incident ?? '');
        
        foreach ($highSeverityKeywords as $keyword) {
            if (strpos($incident, $keyword) !== false) {
                return 'high';
            }
        }
        
        return 'medium';
    }
}