<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\CertificateType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Create test admin user
        $user = User::create([
            'first_name' => 'Test',
            'last_name' => 'Admin',
            'email' => 'test.admin@brgy.gov.ph',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'user_type' => 'admin'
        ]);

        // Create test certificate types
        CertificateType::create([
            'name' => 'Barangay Clearance',
            'description' => 'General purpose barangay clearance',
            'fee' => 50.00
        ]);

        CertificateType::create([
            'name' => 'Certificate of Residency',
            'description' => 'Proof of residency in the barangay',
            'fee' => 30.00
        ]);
    }
}