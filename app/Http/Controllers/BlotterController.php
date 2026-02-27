<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\BarangayResident;
use App\Models\User;
use App\Notifications\BlotterNotification;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BlotterController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->all();
        
        // Create the blotter record
        $blotter = Blotter::create($data);
        
        // Send notification to respondent if respondent_id is provided
        if (!empty($data['respondent_id'])) {
            $this->notifyRespondent($blotter, $data['respondent_id']);
        }
        
        return response()->json(['message' => 'Barangay information created successfully'], 200);
    }
    
    /**
     * Notify the respondent about the blotter case
     */
    private function notifyRespondent(Blotter $blotter, $respondentId)
    {
        try {
            // Find the resident
            $resident = BarangayResident::find($respondentId);
            
            if (!$resident) {
                Log::warning("Resident not found for respondent_id: {$respondentId}");
                return;
            }
            
            // Find the user account associated with this resident
            // Try multiple ways to find the user
            $user = null;
            
            // Method 1: Check by barangay_resident_id
            if ($resident->id) {
                $user = User::where('barangay_resident_id', $resident->id)->first();
            }
            
            // Method 2: Check by username if available
            if (!$user && $resident->username) {
                $user = User::where('username', $resident->username)->first();
            }
            
            // Method 3: Check by email if available
            if (!$user && $resident->emailAddress) {
                $user = User::where('email', $resident->emailAddress)->first();
            }
            
            // Send notifications
            if ($user) {
                // Send Laravel notification (database + email if configured)
                $user->notify(new BlotterNotification($blotter, 'You have been named as a respondent in a blotter case.'));
                
                Log::info("Blotter notification sent to user ID: {$user->id} for blotter ID: {$blotter->id}");
            } else if ($resident->emailAddress) {
                // If no user account but resident has email, send direct email notification
                try {
                    Notification::route('mail', $resident->emailAddress)
                        ->notify(new BlotterNotification($blotter, 'You have been named as a respondent in a blotter case.'));
                    
                    Log::info("Blotter email sent directly to resident email: {$resident->emailAddress} for blotter ID: {$blotter->id}");
                } catch (\Exception $e) {
                    Log::error("Failed to send blotter email to {$resident->emailAddress}: " . $e->getMessage());
                }
            }
            
            // Send SMS notification if phone number is available
            $phoneNumber = $resident->contactNumber ?? $user->contact ?? null;
            
            if ($phoneNumber) {
                $smsService = app(SmsService::class);
                $smsService->sendBlotterNotification($phoneNumber, [
                    'case_number' => 'BLT-' . str_pad($blotter->id, 6, '0', STR_PAD_LEFT),
                    'incident' => $blotter->incident,
                    'status' => $blotter->status ?? 'pending',
                ]);
            }
            
            if (!$user && !$phoneNumber && !$resident->emailAddress) {
                Log::warning("No user account, contact number, or email found for resident ID: {$resident->id}");
            }
        } catch (\Exception $e) {
            // Log error but don't fail the blotter creation
            Log::error('Failed to send blotter notification: ' . $e->getMessage());
        }
    }
    
    public function index()
    {
        $blotters = Blotter::with('respondentResident')->orderBy('id','desc')->paginate(10);
        return response()->json($blotters, 200);
    }
    
    public function show($id)
    {
        $blotter = Blotter::with('respondentResident')->findOrFail($id);
        return response()->json($blotter, 200);
    }
    
    public function update(Request $request, $id)
    {
        $blotter = Blotter::findOrFail($id);
        $oldStatus = $blotter->status;
        
        $blotter->update($request->all());
        
        // Notify respondent if status changed
        if ($request->has('status') && $oldStatus !== $request->status && $blotter->respondent_id) {
            $this->notifyRespondentStatusUpdate($blotter, $oldStatus, $request->status);
        }
        
        return response()->json(['message' => 'Blotter updated successfully', 'data' => $blotter], 200);
    }
    
    /**
     * Notify respondent about blotter status update
     */
    private function notifyRespondentStatusUpdate(Blotter $blotter, $oldStatus, $newStatus)
    {
        try {
            $resident = BarangayResident::find($blotter->respondent_id);
            
            if (!$resident) {
                return;
            }
            
            // Find user account
            $user = User::where('barangay_resident_id', $resident->id)
                ->orWhere('username', $resident->username)
                ->orWhere('email', $resident->emailAddress)
                ->first();
            
            $message = "The status of your blotter case has been updated to: " . ucfirst($newStatus);
            
            if ($user) {
                $user->notify(new BlotterNotification($blotter, $message));
                
                Log::info("Blotter status update notification sent to user ID: {$user->id} for blotter ID: {$blotter->id}");
            } else if ($resident->emailAddress) {
                // If no user account but resident has email, send direct email notification
                try {
                    Notification::route('mail', $resident->emailAddress)
                        ->notify(new BlotterNotification($blotter, $message));
                    
                    Log::info("Blotter status update email sent directly to: {$resident->emailAddress} for blotter ID: {$blotter->id}");
                } catch (\Exception $e) {
                    Log::error("Failed to send status update email to {$resident->emailAddress}: " . $e->getMessage());
                }
            }
            
            // Send SMS notification
            $phoneNumber = $resident->contactNumber ?? ($user->contact ?? null);
            
            if ($phoneNumber) {
                $smsService = app(SmsService::class);
                $caseNumber = 'BLT-' . str_pad($blotter->id, 6, '0', STR_PAD_LEFT);
                $barangayName = config('app.barangay_name', 'Barangay Office');
                
                $smsMessage = "{$barangayName} UPDATE:\n\n";
                $smsMessage .= "Your blotter case {$caseNumber} status has been updated to: " . ucfirst($newStatus) . ".\n\n";
                $smsMessage .= "Please contact the barangay office for more information.";
                
                $smsService->send($phoneNumber, $smsMessage);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send blotter status update notification: ' . $e->getMessage());
        }
    }
    
    public function destroy(Request $request,$id)
    {
        $blotters = Blotter::find($id);
        $blotters->delete();
        return response()->json($blotters);
    }
}
