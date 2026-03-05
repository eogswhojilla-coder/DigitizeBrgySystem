<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementCalendar;
use App\Models\AnnouncementFile;
use App\Models\User;
use App\Notifications\AnnouncementCreatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of announcements with pagination
     */
    public function index()
    {
        $announcements = Announcement::with(['files', 'calendar'])
            ->orderBy('id', 'desc')
            ->paginate(10);
        
        return response()->json($announcements, 200);
    }

    /**
     * Display the specified announcement
     */
    public function show($id)
    {
        $announcement = Announcement::with(['files', 'calendar'])
            ->findOrFail($id);
        
        return response()->json($announcement);
    }

    /**
     * Store a newly created announcement
     */
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after_or_equal:start_at',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create announcement (map 'title' to 'name' for the model)
        $announcement = Announcement::create([
            'name' => $request->title,
            'description' => $request->description,
            'start_at' => $request->start_at,
            'end_at' => $request->end_at,
            'status' => $request->status ?? 'active',
        ]);

        // Create calendar entry
        AnnouncementCalendar::create([
            'news_feed_id' => $announcement->id,
            'type' => 'announcement',
        ]);
        
        // Handle file uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $index => $uploadedFile) {
                try {
                    // Store locally
                    $path = $uploadedFile->store('announcements/' . date("Y/m"), 'public');
                    $url = Storage::disk('public')->url($path);
                    
                    // If using S3, uncomment this:
                    // $path = $uploadedFile->store('announcements/' . date("Y/m"), 's3');
                    // $url = Storage::disk('s3')->url($path);
                    
                    AnnouncementFile::create([
                        'news_feed_id' => $announcement->id,
                        'files' => $url,
                        'type' => 'announcement'
                    ]);
                } catch (\Exception $e) {
                    Log::error('File upload failed: ' . $e->getMessage());
                }
            }
        }
        
        // Send notification to all approved residents
        try {
            $residents = User::where('user_type', 'resident')
                ->where('status', 'approved')
                ->get();
            
            if ($residents->count() > 0) {
                Notification::send($residents, new AnnouncementCreatedNotification($announcement));
                Log::info('Announcement notification sent to ' . $residents->count() . ' residents');
            }
        } catch (\Exception $e) {
            Log::error('Announcement notification failed: ' . $e->getMessage());
            // Don't fail the request if notification fails
        }
        
        return response()->json([
            'message' => 'Announcement created successfully',
            'data' => $announcement->load(['files', 'calendar'])
        ], 201);
    }

    /**
     * Update the specified announcement
     */
    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'start_at' => 'sometimes|date',
            'end_at' => 'sometimes|date|after_or_equal:start_at',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update with validated data
        $updateData = [];
        if ($request->has('title')) $updateData['name'] = $request->title;
        if ($request->has('description')) $updateData['description'] = $request->description;
        if ($request->has('start_at')) $updateData['start_at'] = $request->start_at;
        if ($request->has('end_at')) $updateData['end_at'] = $request->end_at;
        if ($request->has('status')) $updateData['status'] = $request->status;

        $announcement->update($updateData);
        
        return response()->json([
            'message' => 'Announcement updated successfully',
            'data' => $announcement
        ], 200);
    }

    /**
     * Remove the specified announcement
     */
    public function destroy(Request $request, $id)
    {
        $announcement = Announcement::find($id);
        
        if (!$announcement) {
            return response()->json([
                'message' => 'Announcement not found'
            ], 404);
        }
        
        // Delete associated files
        $files = AnnouncementFile::where('news_feed_id', $id)->get();
        foreach ($files as $file) {
            $file->delete();
        }
        
        // Delete calendar entry
        AnnouncementCalendar::where('news_feed_id', $id)->delete();
        
        // Delete announcement
        $announcement->delete();
        
        return response()->json($announcement);
    }
}
