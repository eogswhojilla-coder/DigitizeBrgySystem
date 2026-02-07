<?php

namespace App\Http\Controllers;

use App\Models\BarangayResident;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class RegistrationController extends Controller
{
    /**
     * Register a new resident
     */
    public function registerResident(Request $request)
    {
        DB::beginTransaction();
        
        try {
            // Check if email already exists
            $existingUser = User::where('email', $request->emailAddress)->first();
            if ($existingUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email already registered'
                ], 422);
            }

            // Generate resident ID
            $now = now();
            $residentId = $now->format('mdys');
            
            // Prepare barangay resident data
            $residentData = $request->except(['profileImage', 'confirmPassword', 'username', 'password']);
            $residentData['residentId'] = $residentId;
            $residentData['isOfficial'] = false; // Residents are not officials
            
            // Handle image upload if present
            if ($request->hasFile('profileImage')) {
                $image = $request->file('profileImage');
                $imageName = time() . '_' . uniqid() . '.' . $image->extension();
                $image->move(public_path('images/residents'), $imageName);
                $residentData['profileImage'] = $imageName;
            }
            
            // Clean empty strings to null
            foreach ($residentData as $key => $value) {
                if ($value === '' || $value === 'null') {
                    $residentData[$key] = null;
                }
            }
            
            // Create barangay resident record
            $resident = BarangayResident::create($residentData);
            
            // Create user account with pending status
            $user = User::create([
                'first_name' => $request->firstName,
                'middle_name' => $request->middleName,
                'last_name' => $request->lastName,
                'email' => $request->emailAddress,
                'username' => $request->username,
                'contact' => $request->contactNumber,
                'password' => Hash::make($request->password),
                'user_type' => 'resident',
                'status' => 'pending',
                'barangay_resident_id' => $resident->id,
            ]);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Registration successful! Please wait for admin approval.',
                'data' => [
                    'resident' => $resident,
                    'user' => $user,
                    'residentId' => $residentId
                ]
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all pending accounts
     */
    public function getPendingAccounts(Request $request)
    {
        try {
            $query = User::with('resident')
                ->where('status', 'pending')
                ->where('user_type', 'resident');
            
            $pendingAccounts = $query->orderBy('created_at', 'desc')->paginate(10);
            
            return response()->json($pendingAccounts, 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pending accounts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve an account
     */
    public function approveAccount($id)
    {
        try {
            $user = User::with('resident')->find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }
            
            $user->status = 'approved';
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Account approved successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error approving account',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject an account
     */
    public function rejectAccount($id)
    {
        try {
            $user = User::with('resident')->find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }
            
            $user->status = 'rejected';
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Account rejected successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error rejecting account',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
