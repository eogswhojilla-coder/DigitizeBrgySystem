<?php

namespace App\Http\Controllers;

use App\Models\BarangayResident;
use App\Models\User;
use App\Notifications\AccountApprovedNotification;
use App\Notifications\NewResidentRegistrationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class RegistrationController extends Controller
{
    /**
     * Register a new resident
     */
    public function registerResident(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'profileImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'emailAddress' => 'required|email',
                'firstName' => 'required|string',
                'lastName' => 'required|string',
                'username' => 'required|string|unique:users,username',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/[a-z]/',      // at least one lowercase letter
                    'regex:/[A-Z]/',      // at least one uppercase letter
                    'regex:/[0-9]/',      // at least one digit
                    'regex:/[@$!%*#?&]/', // at least one special character
                ],
                'houseNumber' => 'required|string',
                'street' => 'required|string',
                'zone' => 'required|string',
                'zip' => 'required|string',
                'residencyStatus' => 'required|string',
                'residencyStatusOther' => 'nullable|string',
                'dateStartedLiving' => 'required|date|before_or_equal:today',
                'permanentAddress' => 'nullable|string',
                'contactNumber' => 'required|string|min:10|max:13',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }

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
            
            // Calculate resident type based on duration
            $dateStarted = new \DateTime($request->dateStartedLiving);
            $today = new \DateTime();
            $interval = $today->diff($dateStarted);
            $monthsDiff = ($interval->y * 12) + $interval->m;
            $residentType = $monthsDiff >= 6 ? 'official' : 'temporary';
            
            // Prepare barangay resident data
            $residentData = $request->except(['profileImage', 'confirmPassword', 'username', 'password']);
            $residentData['residentId'] = $residentId;
            $residentData['isOfficial'] = false;
            $residentData['residentType'] = $residentType;
            
            // Auto-fill locked fields
            $residentData['barangay'] = 'Barangay II';
            $residentData['municipality'] = 'San Carlos City';
            $residentData['province'] = 'Negros Occidental';
            
            // Build complete address
            $addressParts = array_filter([
                $request->houseNumber,
                $request->street,
                $request->zone,
                'Barangay II',
                'San Carlos City',
                'Negros Occidental'
            ]);
            $residentData['address'] = implode(', ', $addressParts);
            
            // Handle image upload if present
            if ($request->hasFile('profileImage')) {
                $residentData['profileImage'] = \App\Helpers\FileHelper::toBase64($request->file('profileImage'));
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

            // Notify admin users about new registration
            $admins = User::where('user_type', '!=', 'resident')->get();
            Notification::send($admins, new NewResidentRegistrationNotification($user));
            
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
     * Get resident details by user ID
     */
    public function getResidentDetails($id)
    {
        try {
            $user = User::with('resident')->find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching resident details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve an account
     */
    public function approveAccount(Request $request, $id)
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
            $user->admin_remarks = $request->input('admin_remarks');
            $user->approved_by = Auth::id();
            $user->approval_date = now();
            $user->save();
            
            // Send email notification if user has an email
            if ($user->email) {
                try {
                    $user->notify(new AccountApprovedNotification($user, $user->admin_remarks));
                } catch (\Exception $e) {
                    Log::error('Failed to send approval email notification: ' . $e->getMessage());
                }
            }
            
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
    public function rejectAccount(Request $request, $id)
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
            $user->admin_remarks = $request->input('admin_remarks');
            $user->approved_by = Auth::id();
            $user->approval_date = now();
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

    /**
     * Set resident as temporary
     */
    public function setTemporaryResident(Request $request, $id)
    {
        try {
            $user = User::with('resident')->find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            if (!$user->resident) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resident profile not found'
                ], 404);
            }
            
            // Update resident type to temporary
            $user->resident->residentType = 'temporary';
            $user->resident->save();
            
            // Approve the account with remarks
            $user->status = 'approved';
            $user->admin_remarks = $request->input('admin_remarks', 'Set as temporary resident');
            $user->approved_by = Auth::id();
            $user->approval_date = now();
            $user->save();
            
            // Send email notification if user has an email
            if ($user->email) {
                try {
                    $user->notify(new AccountApprovedNotification($user, $user->admin_remarks));
                } catch (\Exception $e) {
                    Log::error('Failed to send approval email notification: ' . $e->getMessage());
                }
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Account approved as temporary resident',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error setting temporary resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all approved accounts (history)
     */
    public function getApprovedAccounts(Request $request)
    {
        try {
            $query = User::with(['resident', 'approver'])
                ->where('status', 'approved')
                ->where('user_type', 'resident');
            
            // Add search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%");
                });
            }
            
            $approvedAccounts = $query->orderBy('approval_date', 'desc')->paginate(10);
            
            return response()->json($approvedAccounts, 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching approved accounts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Revert approved account back to pending
     */
    public function revertToPending(Request $request, $id)
    {
        try {
            $user = User::with('resident')->find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            if ($user->status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only approved accounts can be reverted to pending'
                ], 400);
            }
            
            $user->status = 'pending';
            $user->admin_remarks = $request->input('admin_remarks', 'Reverted to pending for review');
            $user->approved_by = null;
            $user->approval_date = null;
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Account reverted to pending successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error reverting account to pending',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel an approved account
     */
    public function cancelAccount(Request $request, $id)
    {
        try {
            $user = User::with('resident')->find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            if ($user->status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only approved accounts can be cancelled'
                ], 400);
            }
            
            $user->status = 'cancelled';
            $user->admin_remarks = $request->input('admin_remarks', 'Account cancelled by administrator');
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Account cancelled successfully',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error cancelling account',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
