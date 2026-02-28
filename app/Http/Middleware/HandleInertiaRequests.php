<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        // Get permissions and roles for admin users only
        $permissions = null;
        $roles = null;
        
        if ($user && $user->user_type !== 'resident') {
            $permissions = $user->getAllPermissions()->pluck('name')->toArray();
            $roles = $user->getRoleNames()->toArray();
        }
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'permissions' => $permissions,
                'roles' => $roles,
            ],
            'profile' => $user ? [
                'profileImage' => $user->image ? asset('storage/' . $user->image) : null,
                'firstName' => $user->first_name,
                'middleName' => $user->middle_name,
                'lastName' => $user->last_name,
                'email' => $user->email,
                'contact' => $user->contact,
            ] : null,
        ];
    }
}
