<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\AdminLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        $user = $request->user();
        
        // Log admin/secretary login only
        if (in_array($user->user_type, ['admin', 'secretary'])) {
            AdminLog::createLog(
                $user->id,
                'LOGIN',
                strtoupper($user->user_type) . ": {$user->full_name} | LOGIN",
                $request
            );
        }
        
        if ($user->user_type == 'admin' || $user->user_type == 'secretary') {
            return redirect()->intended(route('dashboard', absolute: false));
        } else if ($user->user_type == 'resident') {
            return redirect()->intended(route('resident.dashboard', absolute: false));
        } else {
            // Default to admin dashboard
            return redirect()->intended(route('dashboard', absolute: false));
        }
    }
    // {
    //         $request->authenticate();

    //         $request->session()->regenerate();

    //         $user = $request->user();

    //         // Redirect based on account_type
    //         if ($user->account_type == 1) {
    //             return redirect()->intended(route('administrator.dashboard', absolute: false));
    //         } else if ($user->account_type == 2) {
    //             return redirect()->intended(route('users.dashboard', absolute: false));
    //         }

    //     }








    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();
        
        // Log admin/secretary logout only
        if ($user && in_array($user->user_type, ['admin', 'secretary'])) {
            AdminLog::createLog(
                $user->id,
                'LOGOUT',
                strtoupper($user->user_type) . ": {$user->full_name} | LOGOUT",
                $request
            );
        }
        
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
