<?php

namespace App\Http\Controllers;

use App\Models\BarangayResident;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        // Query only non-archived residents
        $query = BarangayResident::where('is_archived', false);

        // Apply filters
        $filters = [
            'voters' => $request->input('voters'),
            'age' => $request->input('age'),
            'pwd' => $request->input('pwd'),
            'singleParent' => $request->input('singleParent'),
            'senior' => $request->input('senior'),
        ];

        // Filter by voters
        if ($request->filled('voters')) {
            $query->where('voters', $request->voters);
        }

        // Filter by age
        if ($request->filled('age')) {
            $age = (int)$request->age;
            $query->whereNotNull('dateOfBirth')
                  ->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) = ?', [$age]);
        }

        // Filter by PWD
        if ($request->filled('pwd')) {
            $query->where('pwd', $request->pwd);
        }

        // Filter by Single Parent
        if ($request->filled('singleParent')) {
            $query->where('singleParent', $request->singleParent);
        }

        // Filter by Senior (60+ years old)
        if ($request->filled('senior')) {
            if ($request->senior === 'YES') {
                $query->whereNotNull('dateOfBirth')
                      ->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) >= 60');
            } elseif ($request->senior === 'NO') {
                $query->where(function($q) {
                    $q->whereNull('dateOfBirth')
                      ->orWhereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) < 60');
                });
            }
        }

        $residents = $query->orderBy('firstName', 'asc')
            ->get()
            ->map(function ($resident) {
                $age = null;
                if ($resident->dateOfBirth) {
                    $age = Carbon::parse($resident->dateOfBirth)->age;
                }

                $isSenior = $age && $age >= 60;

                return [
                    'id' => $resident->id,
                    'name' => trim("{$resident->firstName} {$resident->middleName} {$resident->lastName}"),
                    'age' => $age,
                    'pwd' => $resident->pwd ? 'YES' : 'NO',
                    'singleParent' => $resident->singleParent ? 'YES' : 'NO',
                    'voters' => $resident->voters ? 'YES' : 'NO',
                    'senior' => $isSenior ? 'YES' : 'NO',
                    'address' => $resident->address,
                    'gender' => $resident->gender,
                    'civilStatus' => $resident->civilStatus,
                ];
            });

        return Inertia::render('administrator/reports/page', [
            'residents' => $residents,
            'filters' => $filters,
            'totalCount' => $residents->count(),
        ]);
    }

    public function generatePdf(Request $request)
    {
        // Query only non-archived residents
        $query = BarangayResident::where('is_archived', false);

        // Apply the same filters as index
        if ($request->filled('voters')) {
            $query->where('voters', $request->voters);
        }

        if ($request->filled('age')) {
            $age = (int)$request->age;
            $query->whereNotNull('dateOfBirth')
                  ->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) = ?', [$age]);
        }

        if ($request->filled('pwd')) {
            $query->where('pwd', $request->pwd);
        }

        if ($request->filled('singleParent')) {
            $query->where('singleParent', $request->singleParent);
        }

        if ($request->filled('senior')) {
            if ($request->senior === 'YES') {
                $query->whereNotNull('dateOfBirth')
                      ->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) >= 60');
            } elseif ($request->senior === 'NO') {
                $query->where(function($q) {
                    $q->whereNull('dateOfBirth')
                      ->orWhereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) < 60');
                });
            }
        }

        $residents = $query->orderBy('firstName', 'asc')
            ->get()
            ->map(function ($resident) {
                $age = null;
                if ($resident->dateOfBirth) {
                    $age = Carbon::parse($resident->dateOfBirth)->age;
                }

                $isSenior = $age && $age >= 60;

                return [
                    'name' => trim("{$resident->firstName} {$resident->middleName} {$resident->lastName}"),
                    'age' => $age ?? '-',
                    'pwd' => $resident->pwd ? 'YES' : 'NO',
                    'singleParent' => $resident->singleParent ? 'YES' : 'NO',
                    'voters' => $resident->voters ? 'YES' : 'NO',
                    'senior' => $isSenior ? 'YES' : 'NO',
                    'address' => $resident->address,
                    'gender' => $resident->gender,
                ];
            });

        $filters = [
            'voters' => $request->input('voters'),
            'age' => $request->input('age'),
            'pwd' => $request->input('pwd'),
            'singleParent' => $request->input('singleParent'),
            'senior' => $request->input('senior'),
        ];

        $pdf = Pdf::loadView('reports.residents-pdf', [
            'residents' => $residents,
            'filters' => $filters,
            'generatedDate' => Carbon::now()->format('F d, Y'),
            'totalCount' => $residents->count(),
        ]);

        return $pdf->download('residents-report-' . Carbon::now()->format('Y-m-d') . '.pdf');
    }
}
