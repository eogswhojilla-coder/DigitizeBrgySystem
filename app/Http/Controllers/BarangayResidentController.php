<?php

namespace App\Http\Controllers;

use App\Models\BarangayResident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BarangayResidentController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Generate resident ID: mmddyyss format
            $now = now();
            $residentId = $now->format('mdys'); // month, day, year (2 digits), seconds
            
            // Get all data except sensitive/file fields
            $data = $request->except(['profileImage', 'confirmPassword', 'image']);
            
            // Add auto-generated fields
            $data['residentId'] = $residentId;
            $data['isOfficial'] = filter_var($request->input('isOfficial', false), FILTER_VALIDATE_BOOLEAN);
            
            // Handle password hashing if present
            if (!empty($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            } else {
                unset($data['password']);
            }
            
            // Handle image upload if present
            if ($request->hasFile('profileImage')) {
                $image = $request->file('profileImage');
                $imageName = time() . '_' . uniqid() . '.' . $image->extension();
                $image->move(public_path('images/residents'), $imageName);
                $data['profileImage'] = $imageName;
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
            
            return response()->json([
                'success' => true,
                'message' => 'Barangay information created successfully',
                'data' => $resident,
                'residentId' => $residentId
            ], 201);
            
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error creating resident: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred',
                'error' => $e->getMessage()
            ], 500);
            
        } catch (\Exception $e) {
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
        $query = BarangayResident::query();

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
        
        $residents = BarangayResident::where(function($query) use ($searchTerm) {
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
}
