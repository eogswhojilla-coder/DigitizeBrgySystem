<?php

namespace App\Http\Controllers;

use App\Models\Inventories;
use App\Models\BorrowRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Notifications\BorrowRequestApprovedNotification;
use App\Notifications\BorrowRequestDeclinedNotification;

class InventoriesController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'has_fee' => 'nullable|in:0,1,true,false',
            'price' => 'required_if:has_fee,1,true|nullable|numeric|min:0',
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

        // If has_fee is false, set price and gcash_qr to null
        if (!$data['has_fee']) {
            $data['price'] = null;
            $data['gcash_qr'] = null;
        } else {
            // Handle GCash QR upload
            if ($request->hasFile('gcash_qr')) {
                $qrPath = $request->file('gcash_qr')->store('inventory/qr', 'public');
                $data['gcash_qr'] = $qrPath;
            }
        }

        Inventories::create($data);
        return response()->json(['message' => 'New Item created successfully'], 200);
    }

    public function index()
    {
        $inventories = Inventories::orderBy('id', 'desc')->paginate(5);
        
        // Add QR URL to response
        $inventories->getCollection()->transform(function ($inventory) {
            $inventory->gcash_qr_url = $inventory->gcash_qr 
                ? asset('storage/' . $inventory->gcash_qr) 
                : null;
            return $inventory;
        });
        
        return response()->json($inventories, 200);
    }

    public function update(Request $request, $id)
    {
        $inventory = Inventories::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'has_fee' => 'nullable|in:0,1,true,false',
            'price' => 'required_if:has_fee,1,true|nullable|numeric|min:0',
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

        // If has_fee is false, set price and gcash_qr to null
        if (isset($data['has_fee']) && !$data['has_fee']) {
            $data['price'] = null;
            
            // Delete old QR if exists
            if ($inventory->gcash_qr) {
                Storage::disk('public')->delete($inventory->gcash_qr);
            }
            $data['gcash_qr'] = null;
        } else if (isset($data['has_fee']) && $data['has_fee']) {
            // Handle GCash QR upload
            if ($request->hasFile('gcash_qr')) {
                // Delete old QR if exists
                if ($inventory->gcash_qr) {
                    Storage::disk('public')->delete($inventory->gcash_qr);
                }
                
                $qrPath = $request->file('gcash_qr')->store('inventory/qr', 'public');
                $data['gcash_qr'] = $qrPath;
            }
        }

        $inventory->update($data);
        return response()->json([
            'message' => 'Item updated successfully',
            'data' => $inventory
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $inventory = Inventories::findOrFail($id);
        
        // Delete QR code if exists
        if ($inventory->gcash_qr) {
            Storage::disk('public')->delete($inventory->gcash_qr);
        }
        
        $inventory->delete();
        return response()->json([
            'message' => 'Item deleted successfully'
        ], 200);
    }

    // Get all borrow requests for admin
    public function getAllBorrowRequests(Request $request)
    {
        $status = $request->query('status'); // pending, approved, declined, returned
        
        $query = BorrowRequest::with(['inventory', 'user', 'approvedBy', 'rejectedBy'])
            ->orderBy('created_at', 'desc');
        
        if ($status) {
            $query->where('status', strtolower($status));
        }
        
        $requests = $query->get()->map(function ($request) {
            return [
                'id' => $request->id,
                'request_number' => $request->request_number,
                'residentName' => $request->user ? $request->user->first_name . ' ' . $request->user->last_name : 'Unknown',
                'resident_id' => $request->user_id,
                'itemName' => $request->inventory ? $request->inventory->name : 'Unknown Item',
                'inventory_id' => $request->inventory_id,
                'quantity' => $request->quantity,
                'purpose' => $request->purpose,
                'contact_number' => $request->contact_number,
                'borrow_date' => $request->borrow_date?->format('Y-m-d'),
                'return_date' => $request->return_date?->format('Y-m-d'),
                'actual_return_date' => $request->actual_return_date?->format('Y-m-d'),
                'status' => ucfirst($request->status),
                'requestDate' => $request->created_at->format('Y-m-d'),
                'remarks' => $request->remarks,
                'payment_reference' => $request->payment_reference,
                'payment_receipt_url' => $request->payment_receipt 
                    ? asset('storage/' . $request->payment_receipt) 
                    : null,
                'availableStock' => $request->inventory ? $request->inventory->quantity - ($request->inventory->borrowed ?? 0) : 0,
                'approved_by' => $request->approvedBy ? $request->approvedBy->first_name . ' ' . $request->approvedBy->last_name : null,
                'approved_at' => $request->approved_at?->format('Y-m-d H:i:s'),
                'rejected_by' => $request->rejectedBy ? $request->rejectedBy->first_name . ' ' . $request->rejectedBy->last_name : null,
                'rejected_at' => $request->rejected_at?->format('Y-m-d H:i:s'),
            ];
        });
        
        return response()->json([
            'success' => true,
            'data' => $requests
        ], 200);
    }

    // Approve borrow request
    public function approveBorrowRequest(Request $request, $id)
    {
        $borrowRequest = BorrowRequest::with('inventory')->findOrFail($id);
        
        if ($borrowRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending requests can be approved'
            ], 422);
        }

        // Check if inventory has enough quantity
        $inventory = $borrowRequest->inventory;
        $available = $inventory->quantity - ($inventory->borrowed ?? 0);

        if ($available < $borrowRequest->quantity) {
            return response()->json([
                'success' => false,
                'message' => "Insufficient stock. Only {$available} items available"
            ], 422);
        }

        // Update borrow request status
        $borrowRequest->update([
            'status' => 'approved',
            'approved_by' => Auth::id(),
            'approved_at' => now(),
            'remarks' => $request->remarks
        ]);

        // Update inventory borrowed count
        $inventory->increment('borrowed', $borrowRequest->quantity);

        // Send email notification to the resident
        try {
            $borrowRequest->load(['inventory', 'user']);
            if ($borrowRequest->user) {
                $borrowRequest->user->notify(
                    new BorrowRequestApprovedNotification($borrowRequest, $request->remarks)
                );
            }
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::warning('Failed to send borrow request approval email: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Borrow request approved successfully',
            'data' => $borrowRequest
        ], 200);
    }

    // Decline borrow request
    public function declineBorrowRequest(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'remarks' => 'required|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Remarks are required when declining a request',
                'errors' => $validator->errors()
            ], 422);
        }

        $borrowRequest = BorrowRequest::findOrFail($id);
        
        if ($borrowRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending requests can be declined'
            ], 422);
        }

        $borrowRequest->update([
            'status' => 'declined',
            'rejected_by' => Auth::id(),
            'rejected_at' => now(),
            'remarks' => $request->remarks
        ]);

        // Send email notification to the resident
        try {
            $borrowRequest->load(['inventory', 'user']);
            if ($borrowRequest->user) {
                $borrowRequest->user->notify(
                    new BorrowRequestDeclinedNotification($borrowRequest, $request->remarks)
                );
            }
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::warning('Failed to send borrow request decline email: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Borrow request declined',
            'data' => $borrowRequest
        ], 200);
    }

    // Mark as returned
    public function markAsReturned(Request $request, $id)
    {
        $borrowRequest = BorrowRequest::with('inventory')->findOrFail($id);
        
        if ($borrowRequest->status !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Only approved requests can be marked as returned'
            ], 422);
        }

        // Update borrow request
        $borrowRequest->update([
            'status' => 'returned',
            'actual_return_date' => now(),
            'remarks' => $request->remarks
        ]);

        // Update inventory: decrease borrowed count
        $inventory = $borrowRequest->inventory;
        $inventory->decrement('borrowed', $borrowRequest->quantity);

        return response()->json([
            'success' => true,
            'message' => 'Item marked as returned successfully',
            'data' => $borrowRequest
        ], 200);
    }
}
