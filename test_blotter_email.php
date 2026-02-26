<?php

/*
|--------------------------------------------------------------------------
| Blotter Email Notification Test Script
|--------------------------------------------------------------------------
| 
| This script tests the email notification system for blotter reports.
| Run this in Laravel Tinker to test email sending.
|
| Usage:
| php artisan tinker
| include 'test_blotter_email.php';
|
*/

use App\Models\User;
use App\Models\Blotter;
use App\Models\BarangayResident;
use App\Notifications\BlotterNotification;

echo "\n=== Blotter Email Notification Test ===\n\n";

// Test 1: Check if email configuration is correct
echo "1. Checking email configuration...\n";
$mailConfig = [
    'MAIL_MAILER' => env('MAIL_MAILER'),
    'MAIL_HOST' => env('MAIL_HOST'),
    'MAIL_PORT' => env('MAIL_PORT'),
    'MAIL_USERNAME' => env('MAIL_USERNAME'),
    'MAIL_FROM_ADDRESS' => env('MAIL_FROM_ADDRESS'),
];

foreach ($mailConfig as $key => $value) {
    $display = ($key === 'MAIL_PASSWORD') ? '****' : $value;
    echo "   ✓ {$key}: {$display}\n";
}

// Test 2: Find a user with email
echo "\n2. Finding a user with email address...\n";
$user = User::whereNotNull('email')->first();

if (!$user) {
    echo "   ✗ No users found with email addresses!\n";
    echo "   Please create a user with an email first.\n";
    exit;
}

echo "   ✓ Found user: {$user->first_name} {$user->last_name}\n";
echo "   ✓ Email: {$user->email}\n";

// Test 3: Check if we have a blotter
echo "\n3. Checking for blotter records...\n";
$blotter = Blotter::first();

if (!$blotter) {
    echo "   ℹ No blotter records found. Creating a test blotter...\n";
    
    $blotter = new Blotter();
    $blotter->complainant_resident = "Test Complainant";
    $blotter->respondent = $user->full_name;
    $blotter->respondent_id = $user->barangay_resident_id;
    $blotter->incident = "Test Notification Email";
    $blotter->date_of_incident = date('Y-m-d');
    $blotter->location_of_incident = "Test Location";
    $blotter->complainant_statement = "This is a test blotter for email notification testing.";
    $blotter->status = "pending";
    $blotter->date_reported = date('Y-m-d');
    $blotter->save();
    
    echo "   ✓ Test blotter created (ID: {$blotter->id})\n";
} else {
    echo "   ✓ Using existing blotter (ID: {$blotter->id})\n";
}

// Test 4: Send test notification
echo "\n4. Sending email notification...\n";

try {
    $user->notify(new BlotterNotification($blotter, 'TEST: This is a test email notification from your barangay system.'));
    echo "   ✓ Notification sent successfully!\n";
    echo "\n5. Check your email inbox:\n";
    echo "   Email: {$user->email}\n";
    echo "   Subject: Blotter Case Notification - BLT-" . str_pad($blotter->id, 6, '0', STR_PAD_LEFT) . "\n";
    echo "\n   If using log driver, check: storage/logs/laravel.log\n";
    echo "   If using Mailtrap, check your Mailtrap inbox\n";
    echo "   If using Gmail, check your Gmail inbox (might be in spam)\n";
} catch (\Exception $e) {
    echo "   ✗ Error sending notification!\n";
    echo "   Error: {$e->getMessage()}\n";
}

echo "\n=== Test Complete ===\n\n";
