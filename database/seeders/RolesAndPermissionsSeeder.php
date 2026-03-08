<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define all permissions
        $permissions = [
            // RESIDENTS
            'residents.view',
            'residents.create',
            'residents.update',
            'residents.delete',
            'residents.approve',

            // CERTIFICATES
            'certificates.view',
            'certificates.approve',
            'certificates.reject',
            'certificates.generate',
            'certificates.verify_payment',
            'certificates.configure_fees',

            // PAYMENTS
            'payments.view',
            'payments.verify',
            'payments.configure',

            // BLOTTER
            'blotter.view',
            'blotter.create',
            'blotter.update',
            'blotter.resolve',
            'blotter.notify',

            // INVENTORY
            'inventory.view',
            'inventory.create',
            'inventory.update',
            'inventory.delete',
            'borrow.approve',
            'borrow.return',

            // ANNOUNCEMENTS
            'announcements.create',
            'announcements.update',
            'announcements.delete',
            'highlights.manage',

            // REPORTS
            'reports.view',
            'reports.generate',
            'reports.export',

            // SYSTEM
            'users.manage',
            'roles.manage',
            'settings.manage',
            'backups.manage',
            'logs.view',

            // RESIDENT-SPECIFIC
            'certificates.request',
            'borrow.request',
            'profile.view',
            'profile.update',
            'notifications.view',
        ];

        // Create all permissions for 'web' guard (used by sanctum)
        foreach ($permissions as $permission) {
            Permission::create([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        // Create roles and assign permissions

        // 1. SUPER ADMIN - All permissions
        $superAdmin = Role::create([
            'name' => 'Super Admin',
            'guard_name' => 'web'
        ]);
        $superAdmin->givePermissionTo(Permission::all());

        // 2. ADMIN - All operational permissions except role management
        $admin = Role::create([
            'name' => 'Admin',
            'guard_name' => 'web'
        ]);
        $adminPermissions = array_filter($permissions, function($perm) {
            return $perm !== 'roles.manage';
        });
        $admin->givePermissionTo($adminPermissions);

        // 3. SECRETARY - Residents, Certificates, Blotter, Announcements
        $secretary = Role::create([
            'name' => 'Secretary',
            'guard_name' => 'web'
        ]);
        $secretary->givePermissionTo([
            'residents.view',
            'residents.approve',
            'certificates.view',
            'certificates.approve',
            'certificates.reject',
            'certificates.generate',
            'blotter.view',
            'blotter.create',
            'blotter.update',
            'blotter.resolve',
            'blotter.notify',
            'announcements.create',
            'announcements.update',
            'announcements.delete',
            'highlights.manage',
            'reports.view',
        ]);

        // 4. TREASURER - Payments, Certificate payment verification
        $treasurer = Role::create([
            'name' => 'Treasurer',
            'guard_name' => 'web'
        ]);
        $treasurer->givePermissionTo([
            'payments.view',
            'payments.verify',
            'payments.configure',
            'certificates.view',
            'certificates.verify_payment',
            'reports.view',
            'reports.generate',
            'reports.export',
        ]);

        // 5. INVENTORY OFFICER - Inventory and Borrow requests
        $inventoryOfficer = Role::create([
            'name' => 'Inventory Officer',
            'guard_name' => 'web'
        ]);
        $inventoryOfficer->givePermissionTo([
            'inventory.view',
            'inventory.create',
            'inventory.update',
            'inventory.delete',
            'borrow.approve',
            'borrow.return',
            'reports.view',
        ]);

        // 6. RESIDENT - Basic resident permissions
        $resident = Role::create([
            'name' => 'Resident',
            'guard_name' => 'web'
        ]);
        $resident->givePermissionTo([
            'certificates.request',
            'borrow.request',
            'profile.view',
            'profile.update',
            'notifications.view',
        ]);

        $this->command->info('✅ Roles and permissions created successfully!');
        $this->command->newLine();
        $this->command->info('Created Roles:');
        $this->command->info('- Super Admin (All permissions)');
        $this->command->info('- Admin (All except role management)');
        $this->command->info('- Secretary (Residents, Certificates, Blotter, Announcements)');
        $this->command->info('- Treasurer (Payments, Reports)');
        $this->command->info('- Inventory Officer (Inventory, Borrow requests)');
        $this->command->info('- Resident (Certificates, Borrow, Profile, Notifications)');
    }
}
