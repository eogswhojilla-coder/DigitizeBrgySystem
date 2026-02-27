<?php

namespace App\Http\Controllers;

use App\Models\BarangayResident;
use App\Models\Blotter;
use App\Models\BorrowRequest;
use App\Models\CertificateRequest;
use App\Models\Families;
use App\Models\Inventories;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $currentMonth = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        // Calculate stats with comparisons
        $statsData = [
            'totalResidents' => [
                'value' => BarangayResident::count(),
                'change' => $this->calculatePercentageChange(
                    BarangayResident::whereMonth('created_at', $currentMonth->month)->count(),
                    BarangayResident::whereMonth('created_at', $lastMonth->month)->count()
                ),
                'trend' => $this->getTrend(
                    BarangayResident::whereMonth('created_at', $currentMonth->month)->count(),
                    BarangayResident::whereMonth('created_at', $lastMonth->month)->count()
                ),
            ],
            'totalFamilies' => [
                'value' => Families::count(),
                'change' => $this->calculatePercentageChange(
                    Families::whereMonth('created_at', $currentMonth->month)->count(),
                    Families::whereMonth('created_at', $lastMonth->month)->count()
                ),
                'trend' => $this->getTrend(
                    Families::whereMonth('created_at', $currentMonth->month)->count(),
                    Families::whereMonth('created_at', $lastMonth->month)->count()
                ),
            ],
            'activeBlotters' => [
                'value' => Blotter::whereIn('status', ['pending', 'under investigation'])->count(),
                'change' => $this->calculatePercentageChange(
                    Blotter::whereIn('status', ['pending', 'under investigation'])
                        ->whereMonth('created_at', $currentMonth->month)->count(),
                    Blotter::whereIn('status', ['pending', 'under investigation'])
                        ->whereMonth('created_at', $lastMonth->month)->count()
                ),
                'trend' => $this->getTrend(
                    Blotter::whereIn('status', ['pending', 'under investigation'])
                        ->whereMonth('created_at', $currentMonth->month)->count(),
                    Blotter::whereIn('status', ['pending', 'under investigation'])
                        ->whereMonth('created_at', $lastMonth->month)->count()
                ),
            ],
            'pendingCertificates' => [
                'value' => CertificateRequest::where('status', 'pending')->count(),
                'change' => $this->calculatePercentageChange(
                    CertificateRequest::where('status', 'pending')
                        ->whereMonth('created_at', $currentMonth->month)->count(),
                    CertificateRequest::where('status', 'pending')
                        ->whereMonth('created_at', $lastMonth->month)->count()
                ),
                'trend' => $this->getTrend(
                    CertificateRequest::where('status', 'pending')
                        ->whereMonth('created_at', $currentMonth->month)->count(),
                    CertificateRequest::where('status', 'pending')
                        ->whereMonth('created_at', $lastMonth->month)->count()
                ),
            ],
            'inventoryItems' => [
                'value' => Inventories::where('status', 'Active')->count(),
                'change' => $this->calculatePercentageChange(
                    Inventories::where('status', 'Active')
                        ->whereMonth('created_at', $currentMonth->month)->count(),
                    Inventories::where('status', 'Active')
                        ->whereMonth('created_at', $lastMonth->month)->count()
                ),
                'trend' => $this->getTrend(
                    Inventories::where('status', 'Active')
                        ->whereMonth('created_at', $currentMonth->month)->count(),
                    Inventories::where('status', 'Active')
                        ->whereMonth('created_at', $lastMonth->month)->count()
                ),
            ],
            'monthlyRevenue' => [
                'value' => CertificateRequest::where('is_paid', true)
                    ->whereMonth('created_at', $currentMonth->month)
                    ->sum('amount_paid'),
                'change' => $this->calculatePercentageChange(
                    CertificateRequest::where('is_paid', true)
                        ->whereMonth('created_at', $currentMonth->month)
                        ->sum('amount_paid'),
                    CertificateRequest::where('is_paid', true)
                        ->whereMonth('created_at', $lastMonth->month)
                        ->sum('amount_paid')
                ),
                'trend' => $this->getTrend(
                    CertificateRequest::where('is_paid', true)
                        ->whereMonth('created_at', $currentMonth->month)
                        ->sum('amount_paid'),
                    CertificateRequest::where('is_paid', true)
                        ->whereMonth('created_at', $lastMonth->month)
                        ->sum('amount_paid')
                ),
            ],
        ];

        // Gender distribution
        $genderData = [
            ['name' => 'Male', 'value' => BarangayResident::where('gender', 'Male')->count(), 'color' => '#3B82F6'],
            ['name' => 'Female', 'value' => BarangayResident::where('gender', 'Female')->count(), 'color' => '#EC4899'],
        ];

        // Age group distribution
        $ageGroupData = $this->getAgeGroupDistribution();

        // Monthly activity data (last 6 months)
        $monthlyActivityData = $this->getMonthlyActivityData();

        // Blotter status data
        $blotterStatusData = [
            ['name' => 'Resolved', 'value' => Blotter::where('status', 'resolved')->count(), 'color' => '#10B981'],
            ['name' => 'Pending', 'value' => Blotter::where('status', 'pending')->count(), 'color' => '#F59E0B'],
            ['name' => 'Under Investigation', 'value' => Blotter::where('status', 'under investigation')->count(), 'color' => '#EF4444'],
        ];

        // Family distribution data
        $familyDistributionData = [
            ['category' => 'Senior Citizens', 'count' => BarangayResident::whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) >= 60')->count(), 'color' => '#8B5CF6'],
            ['category' => 'PWD', 'count' => BarangayResident::where('pwd', true)->count(), 'color' => '#3B82F6'],
            ['category' => 'Solo Parents', 'count' => BarangayResident::where('singleParent', true)->count(), 'color' => '#EC4899'],
            ['category' => '4Ps Recipients', 'count' => 0, 'color' => '#10B981'], // Add field if available
        ];

        // Inventory data
        $inventoryData = Inventories::where('status', 'Active')
            ->select('name', 'quantity', DB::raw('0 as borrowed'))
            ->get()
            ->map(function ($item) {
                $issued = $item->borrowed ?? 0;
                $total = $item->quantity + $issued;
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'issued' => $issued,
                    'remaining' => $item->quantity,
                    'total' => $total,
                    'percentage' => $total > 0 ? round(($issued / $total) * 100) : 0,
                ];
            })
            ->take(4);

        // Recent transactions
        $recentTransactions = [];
        if (class_exists(BorrowRequest::class)) {
            $recentTransactions = BorrowRequest::with(['inventory', 'user'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'item' => $transaction->inventory->name ?? 'N/A',
                        'borrower' => $transaction->user->first_name . ' ' . $transaction->user->last_name,
                        'date' => $transaction->created_at->format('Y-m-d'),
                        'status' => $transaction->status ?? 'Borrowed',
                        'quantity' => $transaction->quantity ?? 1,
                    ];
                });
        }

        // Activity feed
        $activityFeed = $this->getActivityFeed();

        return Inertia::render('administrator/dashboard/page', [
            'statsData' => $statsData,
            'genderData' => $genderData,
            'ageGroupData' => $ageGroupData,
            'monthlyActivityData' => $monthlyActivityData,
            'blotterStatusData' => $blotterStatusData,
            'familyDistributionData' => $familyDistributionData,
            'inventoryData' => $inventoryData,
            'recentTransactions' => $recentTransactions,
            'activityFeed' => $activityFeed,
        ]);
    }

    private function calculatePercentageChange($current, $previous)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }
        return round((($current - $previous) / $previous) * 100, 1);
    }

    private function getTrend($current, $previous)
    {
        if ($current > $previous) {
            return 'up';
        } elseif ($current < $previous) {
            return 'down';
        }
        return 'neutral';
    }

    private function getAgeGroupDistribution()
    {
        return [
            [
                'ageGroup' => '0-17',
                'count' => BarangayResident::whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) BETWEEN 0 AND 17')->count(),
                'color' => '#8B5CF6'
            ],
            [
                'ageGroup' => '18-35',
                'count' => BarangayResident::whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) BETWEEN 18 AND 35')->count(),
                'color' => '#3B82F6'
            ],
            [
                'ageGroup' => '36-59',
                'count' => BarangayResident::whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) BETWEEN 36 AND 59')->count(),
                'color' => '#10B981'
            ],
            [
                'ageGroup' => '60+',
                'count' => BarangayResident::whereRaw('TIMESTAMPDIFF(YEAR, dateOfBirth, CURDATE()) >= 60')->count(),
                'color' => '#F59E0B'
            ],
        ];
    }

    private function getMonthlyActivityData()
    {
        $data = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $data[] = [
                'month' => $month->format('M'),
                'residents' => BarangayResident::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
                'blotters' => Blotter::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
                'certificates' => CertificateRequest::whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
            ];
        }
        return $data;
    }

    private function getActivityFeed()
    {
        $activities = [];

        // Recent residents
        $recentResidents = BarangayResident::orderBy('created_at', 'desc')
            ->limit(2)
            ->get();
        foreach ($recentResidents as $resident) {
            $activities[] = [
                'id' => 'resident_' . $resident->id,
                'type' => 'resident',
                'message' => "New resident registered: {$resident->firstName} {$resident->lastName}",
                'timestamp' => $resident->created_at->diffForHumans(),
                'icon' => 'user',
            ];
        }

        // Recent certificates
        $recentCertificates = CertificateRequest::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(2)
            ->get();
        foreach ($recentCertificates as $cert) {
            $userName = $cert->user ? "{$cert->user->first_name} {$cert->user->last_name}" : 'Unknown';
            $activities[] = [
                'id' => 'cert_' . $cert->id,
                'type' => 'certificate',
                'message' => "Certificate request by {$userName}",
                'timestamp' => $cert->created_at->diffForHumans(),
                'icon' => 'file',
            ];
        }

        // Recent blotters
        $recentBlotters = Blotter::orderBy('created_at', 'desc')
            ->limit(1)
            ->get();
        foreach ($recentBlotters as $blotter) {
            $activities[] = [
                'id' => 'blotter_' . $blotter->id,
                'type' => 'blotter',
                'message' => "New blotter report filed",
                'timestamp' => $blotter->created_at->diffForHumans(),
                'icon' => 'alert',
            ];
        }

        // Sort by timestamp
        usort($activities, function ($a, $b) {
            return strtotime($b['timestamp']) - strtotime($a['timestamp']);
        });

        return array_slice($activities, 0, 5);
    }
}
