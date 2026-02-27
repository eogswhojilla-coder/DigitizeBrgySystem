<?php

namespace Database\Seeders;

use App\Models\AdminLog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AdminLogSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Get an admin user (assuming there's at least one admin in the database)
        $admin = User::where('user_type', 'admin')->first();

        if (!$admin) {
            $this->command->warn('No admin user found. Please create an admin user first.');
            return;
        }

        // Create sample logs
        $logs = [
            [
                'user_id' => $admin->id,
                'action' => 'LOGIN',
                'message' => "ADMIN: {$admin->full_name} | LOGIN",
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'created_at' => Carbon::now()->subDays(1),
                'updated_at' => Carbon::now()->subDays(1),
            ],
            [
                'user_id' => $admin->id,
                'action' => 'LOGOUT',
                'message' => "ADMIN: {$admin->full_name} | LOGOUT",
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'created_at' => Carbon::now()->subDays(1)->addHours(3),
                'updated_at' => Carbon::now()->subDays(1)->addHours(3),
            ],
            [
                'user_id' => $admin->id,
                'action' => 'LOGIN',
                'message' => "ADMIN: {$admin->full_name} | LOGIN",
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'created_at' => Carbon::now()->subHours(5),
                'updated_at' => Carbon::now()->subHours(5),
            ],
            [
                'user_id' => $admin->id,
                'action' => 'LOGIN',
                'message' => "ADMIN: {$admin->full_name} | LOGIN",
                'ip_address' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'created_at' => Carbon::now()->subHours(2),
                'updated_at' => Carbon::now()->subHours(2),
            ],
        ];

        foreach ($logs as $log) {
            AdminLog::create($log);
        }

        $this->command->info('Admin logs seeded successfully!');
    }
}
