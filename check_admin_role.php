<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = App\Models\User::where('email', 'admin@gmail.com')->first();

if ($user) {
    echo "👤 User: {$user->first_name} {$user->last_name}\n";
    echo "📧 Email: {$user->email}\n";
    echo "🔐 User Type: {$user->user_type}\n";
    echo "🎭 Roles: " . $user->getRoleNames()->implode(', ') . "\n";
    echo "✅ Has 'roles.manage' permission: " . ($user->hasPermissionTo('roles.manage') ? 'YES' : 'NO') . "\n";
    echo "\nAll Permissions:\n";
    foreach ($user->getAllPermissions()->pluck('name') as $permission) {
        echo "  - $permission\n";
    }
} else {
    echo "❌ User not found\n";
}
