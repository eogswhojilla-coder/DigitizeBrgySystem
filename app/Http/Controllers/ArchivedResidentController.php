<?php

namespace App\Http\Controllers;

use App\Models\ArchivedResident;
use App\Models\BarangayResident;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ArchivedResidentController extends Controller
{
    /**
     * Display a listing of archived residents
     */
    public function index(Request $request)
    {
        $query = ArchivedResident::with('resident');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('resident_number', 'like', "%{$search}%");
            });
        }

        // Filter by archive reason
        if ($request->filled('archive_reason')) {
            $query->where('archive_reason', $request->archive_reason);
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $archived = $query->orderBy('archive_date', 'desc')
            ->paginate($perPage)
            ->through(function ($archive) {
                $resident = $archive->resident;
                
                return [
                    'id' => $archive->id,
                    'residentId' => $archive->resident_id,
                    'residentNumber' => $archive->resident_number,
                    'image' => $resident && $resident->profileImage 
                        ? asset('images/residents/' . $resident->profileImage) 
                        : null,
                    'name' => $archive->full_name,
                    'archiveReason' => $archive->archive_reason,
                    'archiveReasonLabel' => $archive->archive_reason_label,
                    'archiveDate' => $archive->archive_date->format('Y-m-d'),
                    'archiveNotes' => $archive->archive_notes,
                    'wasOfficial' => $archive->was_official,
                    'positionHeld' => $archive->position_held,
                    'contactNumber' => $archive->contact_number,
                    'address' => $archive->address,
                ];
            });

        return response()->json($archived);
    }

    /**
     * Archive a resident
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'resident_id' => 'required|exists:barangay_residents,id',
                'archive_reason' => 'required|in:moved_out,passed_away,duplicate_entry,lost_jurisdiction,inactive_years',
                'archive_notes' => 'nullable|string',
            ]);

            $resident = BarangayResident::findOrFail($validated['resident_id']);

            // Check if already archived
            $existing = ArchivedResident::where('resident_id', $resident->id)->first();
            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'This resident is already archived'
                ], 400);
            }

            // Create archive record with snapshot data
            $archived = ArchivedResident::create([
                'resident_id' => $resident->id,
                'archive_reason' => $validated['archive_reason'],
                'archive_notes' => $validated['archive_notes'] ?? null,
                'archive_date' => now(),
                'archived_by' => Auth::user()->username ?? 'System',
                'resident_number' => $resident->residentId,
                'full_name' => trim("{$resident->firstName} {$resident->middleName} {$resident->lastName}"),
                'contact_number' => $resident->contactNumber,
                'address' => $resident->address,
                'was_official' => $resident->isOfficial ?? false,
                'position_held' => $resident->position,
            ]);

            // Mark resident as archived
            $resident->update(['is_archived' => true]);

            Log::info("Archived resident: {$archived->full_name} - Reason: {$validated['archive_reason']}");

            return response()->json([
                'success' => true,
                'message' => 'Resident archived successfully',
                'data' => $archived
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Error archiving resident: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error archiving resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore an archived resident
     */
    public function restore($id)
    {
        try {
            $archived = ArchivedResident::findOrFail($id);
            $resident = $archived->resident;

            if (!$resident) {
                return response()->json([
                    'success' => false,
                    'message' => 'Original resident record not found'
                ], 404);
            }

            // Unmark as archived
            $resident->update(['is_archived' => false]);

            // Delete the archive record
            $archived->delete();

            return response()->json([
                'success' => true,
                'message' => 'Resident restored successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error restoring resident: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error restoring resident',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an archived record permanently
     */
    public function destroy($id)
    {
        try {
            $archived = ArchivedResident::findOrFail($id);
            $archived->delete();

            return response()->json([
                'success' => true,
                'message' => 'Archive record deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting archive record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate PDF report of archived residents
     */
    public function generatePdf(Request $request)
    {
        try {
            $query = ArchivedResident::with('resident');

            // Filter by search
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('full_name', 'like', "%{$search}%")
                      ->orWhere('resident_number', 'like', "%{$search}%");
                });
            }

            // Filter by archive reason
            $archiveReason = null;
            if ($request->filled('archive_reason')) {
                $archiveReason = $request->archive_reason;
                $query->where('archive_reason', $archiveReason);
            }

            $archived = $query->orderBy('archive_date', 'desc')
                ->get()
                ->map(function ($archive) {
                    return [
                        'resident_number' => $archive->resident_number,
                        'name' => $archive->full_name,
                        'archive_reason' => $archive->archive_reason_label,
                        'archive_date' => Carbon::parse($archive->archive_date)->format('M d, Y'),
                        'was_official' => $archive->was_official ? 'YES' : 'NO',
                        'position_held' => $archive->position_held ?? '-',
                        'contact_number' => $archive->contact_number ?? '-',
                        'address' => $archive->address ?? '-',
                        'notes' => $archive->archive_notes ?? '-',
                    ];
                });

            $reportType = $archiveReason ? 'Filtered by Reason' : 'General Report';
            $reasonLabel = $archiveReason ? $this->getReasonLabel($archiveReason) : 'All Reasons';

            $pdf = Pdf::loadView('reports.archived-residents-pdf', [
                'archived' => $archived,
                'reportType' => $reportType,
                'archiveReason' => $reasonLabel,
                'generatedDate' => Carbon::now()->format('F d, Y'),
                'generatedTime' => Carbon::now()->format('h:i A'),
                'totalCount' => $archived->count(),
            ]);

            $filename = 'archived-residents-' . ($archiveReason ?? 'all') . '-' . Carbon::now()->format('Y-m-d') . '.pdf';
            
            return $pdf->download($filename);

        } catch (\Exception $e) {
            Log::error('Error generating archived residents PDF: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error generating PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get human-readable label for archive reason
     */
    private function getReasonLabel($reason)
    {
        $reasons = [
            'moved_out' => 'Moved out of the barangay',
            'passed_away' => 'Passed away',
            'duplicate_entry' => 'Duplicate entry',
            'lost_jurisdiction' => 'Lost jurisdiction eligibility',
            'inactive_years' => 'Inactive for many years',
        ];

        return $reasons[$reason] ?? $reason;
    }
}
