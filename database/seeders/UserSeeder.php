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
            'first_name' => 'Barangay',
            'last_name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin'),
            'user_type' => 'admin',
            'status' => 'approved', // Admin is always approved
        ]);

        // Resident User
        User::create([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'resident@gmail.com',
            'password' => Hash::make('resident'),
            'user_type' => 'resident',
            'status' => 'approved', // Set as approved by default
        ]);
        
        $this->call([
            BarangayResidentsSeeder::class,
        ]);
    }
}
