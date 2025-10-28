<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Check if user has the required user_type (not role)
        if ($request->user()->user_type !== $role) {
            // Redirect based on their actual user_type
            if ($request->user()->user_type === 'admin') {
                return redirect('/administrator/dashboard');
            } elseif ($request->user()->user_type === 'resident') {
                return redirect('/resident/dashboard');
            }
            
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
