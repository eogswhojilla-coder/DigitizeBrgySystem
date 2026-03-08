<?php

namespace App\Http\Controllers;

use App\Models\BarangayResident;
use App\Models\BarangayOfficialEndTerm;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BarangayResidentController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        
        try {
            // Generate resident ID: mmddyyss format
            $now = now();
            $residentId = $now->format('mdys'); // month, day, year (2 digits), seconds
            
            // Get all data except sensitive/file fields
            $data = $request->except(['profileImage', 'confirmPassword', 'image', 'username', 'password']);
            
            // Add auto-generated fields
            $data['residentId'] = $residentId;
            $data['isOfficial'] = filter_var($request->input('isOfficial', false), FILTER_VALIDATE_BOOLEAN);
            
            // Auto-fill locked fields
            $data['barangay'] = 'Barangay II';
            $data['municipality'] = 'San Carlos City';
            $data['province'] = 'Negros Occidental';
            
            // Handle image upload if present
            if ($request->hasFile('profileImage')) {
                $data['profileImage'] = \App\Helpers\FileHelper::toBase64($request->file('profileImage'));
            }
            
            // If not official, clear position-related fields
            if (!$data['isOfficial']) {
                $data['position'] = null;
                $data['startDate'] = null;
                $data['endDate'] = null;
            }
            
            // Clean empty strings to null
            foreach ($data as $key => $value) {
                if ($value === '' || $value === 'null') {
                    $data[$key] = null;
                }
            }
            
            $resident = BarangayResident::create($data);
            
            // Create User account with approved status if username and password are provided
            $user = null;
            if ($request->filled('username') && $request->filled('password')) {
                $user = User::create([
                    'first_name' => $request->input('firstName'),
                    'middle_name' => $request->input('middleName'),
                    'last_name' => $request->input('lastName'),
                    'email' => $request->input('emailAddress'),
                    'username' => $request->input('username'),
                    'contact' => $request->input('contactNumber'),
                    'password' => Hash::make($request->input('password')),
                    'user_type' => 'resident',
                    'status' => 'approved',
                    'barangay_resident_id' => $resident->id,
                    'approved_by' => auth()->id(),
                    'approval_date' => now(),
                ]);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Resident created successfully with approved account',
                'data' => $resident,
                'residentId' => $residentId
            ], 201);
            
        } catch (\Illuminate\Database\QueryException $e) {
            DB::rollBack();
            Log::error('Database error creating resident: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred',
                'error' => $e->getMessage()
            ], 500);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating resident: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating resident',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => basename($e->getFile())
            ], 500);
        }
    }
    
    public function index(Request $request)
    {
        // Automatically check and move expired officials before loading list
        if ($request->is('api/barangay_officials*')) {
            $this->checkAndMoveExpiredOfficials();
        }

        $query = BarangayResident::query();

        // Exclude archived residents
        $query->where('is_archived', false);

        // Filter by isOfficial based on route
        if ($request->is('api/barangay_officials*')) {
            $query->where('isOfficial', true);
        } elseif ($request->is('api/barangay_residents*')) {
            $query->where('isOfficial', false);
        }

        // Apply filters
        if ($request->has('firstName') && $request->firstName != '') {
            $query->where('firstName', 'like', '%' . $request->firstName . '%');
        }

        if ($request->has('middleName') && $request->middleName != '') {
            $query->where('middleName', 'like', '%' . $request->middleName . '%');
        }

        if ($request->has('lastName') && $request->lastName != '') {
            $query->where('lastName', 'like', '%' . $request->lastName . '%');
        }

        if ($request->has('voters') && $request->voters != '') {
            $query->where('voters', $request->voters);
        }

        if ($request->has('age') && $request->age != '') {
            $query->where('age', $request->age);
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        if ($request->has('pwd') && $request->pwd != '') {
            $query->where('pwd', $request->pwd);
        }

        if ($request->has('singleParent') && $request->singleParent != '') {
            $query->where('singleParent', $request->singleParent);
        }

        if ($request->has('residentNumber') && $request->residentNumber != '') {
            $query->where('residentId', 'like', '%' . $request->residentNumber . '%');
        }

        $barangay_residents = $query->orderBy('id', 'desc')->paginate(10);
        
        return response()->json($barangay_residents, 200);
    }
    
    public function destroy(Request $request, $id)
    {
        try {
            $barangay_residents = BarangayResident::find($id);
            
            if (!$barangay_residents) {
                return response()->json(['message' => 'Resident not found'], 404);
            }
            
            $barangay_residents->delete();
            
            return response()->json(['message' => 'Resident deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Search residents for autocomplete
    public function search(Request $request)
    {
        $searchTerm = $request->input('search', '');
        
        $residents = BarangayResident::where('is_archived', false)
            ->where(function($query) use ($searchTerm) {
                $query->where('firstName', 'like', '%' . $searchTerm . '%')
                      ->orWhere('middleName', 'like', '%' . $searchTerm . '%')
                      ->orWhere('lastName', 'like', '%' . $searchTerm . '%')
                      ->orWhereRaw("CONCAT(firstName, ' ', middleName, ' ', lastName) like ?", ['%' . $searchTerm . '%'])
                      ->orWhereRaw("CONCAT(firstName, ' ', lastName) like ?", ['%' . $searchTerm . '%']);
            })
            ->limit(10)
            ->get(['id', 'firstName', 'middleName', 'lastName', 'residentId']);
        
        return response()->json($residents);
    }

    public function assignPosition(Request $request, $id)
    {
        try {
            $resident = BarangayResident::find($id);
            
            if (!$resident) {
                return response()->json([
                    'success' => false,
                    'message' => 'Resident not found'
                ], 404);
            }

            // Validate the request data
            $validated = $request->validate([
                'position' => 'required|string',
                'startDate' => 'required|date',
                'endDate' => 'required|date|after:startDate',
                'isOfficial' => 'required|boolean'
            ]);

            // Update the resident with official information
            $resident->update([
                'position' => $validated['position'],
                'startDate' => $validated['startDate'],
                'endDate' => $validated['endDate'],
                'isOfficial' => $validated['isOfficial']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Position assigned successfully',
                'data' => $resident
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Error assigning position: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error assigning position',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Private method to check and move expired officials
     * Called automatically when loading officials list
     */
    private function checkAndMoveExpiredOfficials()
    {
        $today = Carbon::now();

        // Get all active officials whose term has ended (exclude archived)
        $expiredOfficials = BarangayResident::where('isOfficial', true)
            ->where('is_archived', false)
            ->whereNotNull('endDate')
            ->whereDate('endDate', '<', $today)
            ->get();

        foreach ($expiredOfficials as $official) {
            // Check if already moved to prevent duplicates
            $existingEndTerm = BarangayOfficialEndTerm::where('official_id', $official->id)
                ->where('term_to', $official->endDate)
                ->first();

            if (!$existingEndTerm) {
                // Create end term record
                BarangayOfficialEndTerm::create([
                    'official_id' => $official->id,
                    'position' => $official->position,
                    'senior' => Carbon::parse($official->dateOfBirth)->age >= 60,
                    'term_from' => $official->startDate,
                    'term_to' => $official->endDate,
                    'pwd' => $official->pwd,
                    'single_parent' => $official->singleParent,
                    'voters' => $official->voters,
                    'status' => 'NOT ACTIVE',
                    'date_deleted' => now(),
                ]);

                // Remove official status and clear position data
                $official->update([
                    'isOfficial' => false,
                    'position' => null,
                    'startDate' => null,
                    'endDate' => null,
                ]);

                Log::info("Moved expired official to end term: {$official->firstName} {$official->lastName}");
            }
        }
    }
}
