<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AssignAdminRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder assigns roles to existing admin users.
     * By default, it assigns "Super Admin" to the first admin user.
     */
    public function run(): void
    {
        // Find all admin users
        $adminUsers = User::where('user_type', 'admin')->get();

        if ($adminUsers->isEmpty()) {
            $this->command->warn('⚠️  No admin users found in the database.');
            $this->command->info('Please create an admin user first, then run this seeder.');
            return;
        }

        $superAdminRole = Role::where('name', 'Super Admin')->first();
        $adminRole = Role::where('name', 'Admin')->first();

        if (!$superAdminRole || !$adminRole) {
            $this->command->error('❌ Roles not found! Please run RolesAndPermissionsSeeder first.');
            return;
        }

        $this->command->info('Found ' . $adminUsers->count() . ' admin user(s)');
        $this->command->newLine();

        // Assign Super Admin to the first admin user
        $firstAdmin = $adminUsers->first();
        
        if (!$firstAdmin->hasRole('Super Admin')) {
            $firstAdmin->assignRole('Super Admin');
            $this->command->info("✅ Assigned 'Super Admin' role to: {$firstAdmin->full_name} ({$firstAdmin->email})");
        } else {
            $this->command->info("ℹ️  {$firstAdmin->full_name} already has Super Admin role");
        }

        // Assign Admin role to other admin users
        foreach ($adminUsers->skip(1) as $admin) {
            if (!$admin->hasAnyRole(['Super Admin', 'Admin'])) {
                $admin->assignRole('Admin');
                $this->command->info("✅ Assigned 'Admin' role to: {$admin->full_name} ({$admin->email})");
            } else {
                $this->command->info("ℹ️  {$admin->full_name} already has a role assigned");
            }
        }

        $this->command->newLine();
        $this->command->info('🎉 Admin roles assigned successfully!');
        $this->command->newLine();
        $this->command->info('To assign different roles, use:');
        $this->command->info('  php artisan tinker');
        $this->command->info('  $user = User::find(ID);');
        $this->command->info('  $user->assignRole("Secretary");');
    }
}
    