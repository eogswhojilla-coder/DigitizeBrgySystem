<?php

namespace App\Http\Controllers;

use App\Models\BarangayOfficialEndTerm;
use App\Models\BarangayResident;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class BarangayOfficialEndTermController extends Controller
{
    public function index(Request $request)
    {
        $query = BarangayOfficialEndTerm::with('official');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('official', function($q) use ($search) {
                $q->where('firstName', 'like', "%{$search}%")
                  ->orWhere('lastName', 'like', "%{$search}%")
                  ->orWhere('middleName', 'like', "%{$search}%");
            })->orWhere('position', 'like', "%{$search}%");
        }

        // Position filter
        if ($request->filled('position') && $request->position !== 'ALL POSITION') {
            $query->where('position', $request->position);
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $officials = $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->through(function ($endTerm) {
                $official = $endTerm->official;
                
                return [
                    'id' => $endTerm->id,
                    'officialNumber' => $official->residentId ?? 'N/A',
                    'image' => $official->profileImage 
                        ? asset('images/residents/' . $official->profileImage) 
                        : null,
                    'position' => $endTerm->position,
                    'name' => trim("{$official->firstName} {$official->middleName} {$official->lastName}"),
                    'pwd' => $endTerm->pwd ? 'YES' : 'NO',
                    'singleParent' => $endTerm->single_parent ? 'YES' : 'NO',
                    'voters' => $endTerm->voters ? 'YES' : 'NO',
                    'status' => 'NOT ACTIVE',
                    'termFrom' => $endTerm->term_from,
                    'termTo' => $endTerm->term_to,
                    'dateDeleted' => $endTerm->date_deleted,
                    // Full resident data for detail view
                    'resident' => [
                        'id' => $official->id,
                        'residentId' => $official->residentId,
                        'profileImage' => $official->profileImage,
                        'firstName' => $official->firstName,
                        'middleName' => $official->middleName,
                        'lastName' => $official->lastName,
                        'suffix' => $official->suffix,
                        'dateOfBirth' => $official->dateOfBirth,
                        'placeOfBirth' => $official->placeOfBirth,
                        'gender' => $official->gender,
                        'civilStatus' => $official->civilStatus,
                        'religion' => $official->religion,
                        'nationality' => $official->nationality,
                        'contactNumber' => $official->contactNumber,
                        'emailAddress' => $official->emailAddress,
                        'address' => $official->address,
                        'houseNumber' => $official->houseNumber,
                        'street' => $official->street,
                        'purokSitio' => $official->purokSitio,
                        'subdivision' => $official->subdivision,
                        'barangay' => $official->barangay,
                        'municipality' => $official->municipality,
                        'province' => $official->province,
                        'zip' => $official->zip,
                        'residencyStatus' => $official->residencyStatus,
                        'residencyStatusOther' => $official->residencyStatusOther,
                        'residentType' => $official->residentType,
                        'dateStartedLiving' => $official->dateStartedLiving,
                        'fatherName' => $official->fatherName,
                        'motherName' => $official->motherName,
                        'guardianName' => $official->guardianName,
                        'guardianContact' => $official->guardianContact,
                        'voters' => $endTerm->voters ? 'YES' : 'NO',
                        'pwd' => $endTerm->pwd ? 'YES' : 'NO',
                        'singleParent' => $endTerm->single_parent ? 'YES' : 'NO',
                        'status' => 'NOT ACTIVE',
                        'isOfficial' => false, // No longer an official
                        'position' => $endTerm->position, // Former position
                        'startDate' => $endTerm->term_from,
                        'endDate' => $endTerm->term_to,
                    ],
                ];
            });

        return Inertia::render('administrator/barangay_residents/official_end_term/page', [
            'officials' => $officials,
            'filters' => [
                'search' => $request->search,
                'position' => $request->position,
                'per_page' => $perPage,
            ]
        ]);
    }

    /**
     * Check and move officials whose term has ended
     */
    public function checkAndMoveExpiredOfficials()
    {
        $today = Carbon::now();

        // Get all active officials whose term has ended (exclude archived)
        $expiredOfficials = BarangayResident::where('isOfficial', true)
            ->where('is_archived', false)
            ->whereNotNull('endDate')
            ->whereDate('endDate', '<', $today)
            ->get();

        $movedCount = 0;

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

                $movedCount++;
            }
        }

        return response()->json([
            'message' => 'Expired officials moved successfully',
            'count' => $movedCount
        ]);
    }

    /**
     * Generate PDF report for officials whose term ended
     */
    public function generatePdf(Request $request)
    {
        $query = BarangayOfficialEndTerm::with('official');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('official', function($q) use ($search) {
                $q->where('firstName', 'like', "%{$search}%")
                  ->orWhere('lastName', 'like', "%{$search}%")
                  ->orWhere('middleName', 'like', "%{$search}%");
            })->orWhere('position', 'like', "%{$search}%");
        }

        // Apply position filter
        if ($request->filled('position') && $request->position !== 'ALL POSITION') {
            $query->where('position', $request->position);
        }

        $endTermOfficials = $query->orderBy('created_at', 'desc')->get();

        // Map data for PDF
        $officials = $endTermOfficials->map(function ($endTerm) {
            $official = $endTerm->official;
            
            return [
                'officialNumber' => $official->residentId ?? 'N/A',
                'name' => trim("{$official->firstName} {$official->middleName} {$official->lastName}"),
                'position' => $endTerm->position,
                'pwd' => $endTerm->pwd ? 'YES' : 'NO',
                'single_parent' => $endTerm->single_parent ? 'YES' : 'NO',
                'voters' => $endTerm->voters ? 'YES' : 'NO',
                'term_from' => $endTerm->term_from ? Carbon::parse($endTerm->term_from)->format('M d, Y') : 'N/A',
                'term_to' => $endTerm->term_to ? Carbon::parse($endTerm->term_to)->format('M d, Y') : 'N/A',
                'date_deleted' => $endTerm->date_deleted ? Carbon::parse($endTerm->date_deleted)->format('M d, Y') : 'N/A',
            ];
        });

        // Prepare filter info for PDF
        $filterInfo = [];
        if ($request->filled('search')) {
            $filterInfo[] = "Search: {$request->search}";
        }
        if ($request->filled('position') && $request->position !== 'ALL POSITION') {
            $filterInfo[] = "Position: {$request->position}";
        }

        $data = [
            'officials' => $officials,
            'total_count' => $officials->count(),
            'generated_at' => Carbon::now()->format('F d, Y h:i A'),
            'has_filters' => !empty($filterInfo),
            'filter_info' => implode(' | ', $filterInfo),
        ];

        $pdf = Pdf::loadView('pdf.official-end-term-pdf', $data)
                  ->setPaper('a4', 'landscape');

        $filename = 'official-end-term-' . Carbon::now()->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }
}
