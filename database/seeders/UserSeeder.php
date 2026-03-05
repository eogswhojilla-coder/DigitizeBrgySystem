<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'first_name' => 'HEAD',
            'last_name' => 'IT',
            'email' => 'super.admin@gmail.com',
            'password' => Hash::make('admin'),
            'user_type' => 'admin',
            'status' => 'approved', // Admin is always approved
        ]);

        // Resident User
        $residentUser = User::create([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'resident@gmail.com',
            'password' => Hash::make('resident'),
            'user_type' => 'resident',
            'status' => 'approved', // Set as approved by default
        ]);
        
        // Assign Resident role if Spatie roles exist
        if (class_exists(\Spatie\Permission\Models\Role::class)) {
            $residentRole = \Spatie\Permission\Models\Role::where('name', 'Resident')->first();
            if ($residentRole) {
                $residentUser->assignRole('Resident');
            }
        }
        
        $this->call([
            BarangayResidentsSeeder::class,
        ]);
    }
}
