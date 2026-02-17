<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\BarangayResident;
use App\Models\User;
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
            try {
                // Find the resident
                $resident = BarangayResident::find($data['respondent_id']);
                
                if ($resident && $resident->username) {
                    // Find the user account associated with this resident
                    $user = User::where('username', $resident->username)->first();
                    
                    if ($user) {
                        // Create a notification in the database
                        DB::table('notifications')->insert([
                            'id' => Str::uuid(),
                            'type' => 'App\Notifications\BlotterNotification',
                            'notifiable_type' => 'App\Models\User',
                            'notifiable_id' => $user->id,
                            'data' => json_encode([
                                'blotter_id' => $blotter->id,
                                'message' => 'You have been named as a respondent in a blotter case.',
                                'incident' => $blotter->incident,
                                'date_reported' => $blotter->date_reported,
                                'status' => $blotter->status,
                            ]),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            } catch (\Exception $e) {
                // Log error but don't fail the blotter creation
                Log::error('Failed to send blotter notification: ' . $e->getMessage());
            }
        }
        
        return response()->json(['message' => 'Barangay information created successfully'], 200);
    }
    
    public function index()
    {
        $blotters = Blotter::with('respondentResident')->orderBy('id','desc')->paginate(10);
        return response()->json($blotters, 200);
    }
    
    public function destroy(Request $request,$id)
    {
        $blotters = Blotter::find($id);
        $blotters->delete();
        return response()->json($blotters);
    }
}
