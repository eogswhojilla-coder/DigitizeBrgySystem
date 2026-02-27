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
        $query = BarangayResident::query();

        // Apply filters
        $filters = [
            'voters' => $request->input('voters'),
            'age' => $request->input('age'),
            'status' => $request->input('status'),
            'pwd' => $request->input('pwd'),
            'singleParent' => $request->input('singleParent'),
            'senior' => $request->input('senior'),
        ];

        // Filter by voters
        if ($request->filled('voters')) {
            if ($request->voters === 'YES') {
                $query->where('voters', true);
            } elseif ($request->voters === 'NO') {
                $query->where('voters', false);
            }
        }

        // Filter by age
        if ($request->filled('age')) {
            $age = (int)$request->age;
            $query->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) = ?', [$age]);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by PWD
        if ($request->filled('pwd')) {
            if ($request->pwd === 'YES') {
                $query->where('pwd', true);
            } elseif ($request->pwd === 'NO') {
                $query->where('pwd', false);
            }
        }

        // Filter by Single Parent
        if ($request->filled('singleParent')) {
            if ($request->singleParent === 'YES') {
                $query->where('singleParent', true);
            } elseif ($request->singleParent === 'NO') {
                $query->where('singleParent', false);
            }
        }

        // Filter by Senior (60+ years old)
        if ($request->filled('senior')) {
            if ($request->senior === 'YES') {
                $query->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) >= 60');
            } elseif ($request->senior === 'NO') {
                $query->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) < 60');
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
                    'status' => $resident->status ?? 'ACTIVE',
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
        $query = BarangayResident::query();

        // Apply the same filters as index
        if ($request->filled('voters')) {
            if ($request->voters === 'YES') {
                $query->where('voters', true);
            } elseif ($request->voters === 'NO') {
                $query->where('voters', false);
            }
        }

        if ($request->filled('age')) {
            $age = (int)$request->age;
            $query->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) = ?', [$age]);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('pwd')) {
            if ($request->pwd === 'YES') {
                $query->where('pwd', true);
            } elseif ($request->pwd === 'NO') {
                $query->where('pwd', false);
            }
        }

        if ($request->filled('singleParent')) {
            if ($request->singleParent === 'YES') {
                $query->where('singleParent', true);
            } elseif ($request->singleParent === 'NO') {
                $query->where('singleParent', false);
            }
        }

        if ($request->filled('senior')) {
            if ($request->senior === 'YES') {
                $query->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) >= 60');
            } elseif ($request->senior === 'NO') {
                $query->whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) < 60');
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
                    'status' => $resident->status ?? 'ACTIVE',
                    'senior' => $isSenior ? 'YES' : 'NO',
                    'address' => $resident->address,
                    'gender' => $resident->gender,
                ];
            });

        $filters = [
            'voters' => $request->input('voters'),
            'age' => $request->input('age'),
            'status' => $request->input('status'),
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
