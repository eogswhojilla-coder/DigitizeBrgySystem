<?php

namespace App\Http\Controllers;

use App\Models\AdminLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SystemLogsController extends Controller
{
    /**
     * Display the system logs page with filtered data.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('per_page', 10);

        $logs = AdminLog::with('user')
            ->when($search, function ($query, $search) {
                return $query->where('message', 'like', "%{$search}%")
                    ->orWhere('action', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                          ->orWhere('middle_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%");
                    });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Transform logs for display
        $transformedLogs = $logs->through(function ($log) {
            $userTypeDisplay = 'SYSTEM';
            if ($log->user) {
                $userTypeDisplay = match($log->user->user_type ?? 'admin') {
                    'admin' => 'ADMIN',
                    'secretary' => 'SECRETARY',
                    'treasurer' => 'TREASURER',
                    'inventory_officer' => 'INVENTORY OFFICER',
                    default => strtoupper($log->user->user_type ?? 'admin')
                };
            }
            
            return [
                'id' => $log->id,
                'user_name' => $log->user 
                    ? ($log->user->full_name ?? 'Unknown User')
                    : 'System',
                'user_type' => $userTypeDisplay,
                'action' => $log->action,
                'message' => $log->message,
                'ip_address' => $log->ip_address,
                'date' => $log->created_at->format('d-m-Y h:i A'),
                'timestamp' => $log->created_at->toDateTimeString(),
            ];
        });

        return Inertia::render('administrator/system_logs/page', [
            'logs' => $transformedLogs,
            'search' => $search,
            'perPage' => $perPage,
        ]);
    }
}
