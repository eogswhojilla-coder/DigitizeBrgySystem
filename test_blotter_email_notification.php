<?php

/**
 * Test script for Blotter Email Notification
 * Run this with: php test_blotter_email_notification.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\Blotter;
use App\Notifications\BlotterNotification;
use Illuminate\Support\Facades\Notification;

echo "==============================================\n";
echo "Testing Blotter Email Notification\n";
echo "==============================================\n\n";

// Test email address - change this to your test email
$testEmail = 'hojilla@csr-scc.edu.ph';

echo "Checking mail configuration...\n";
echo "MAIL_MAILER: " . config('mail.default') . "\n";
echo "MAIL_HOST: " . config('mail.mailers.smtp.host') . "\n";
echo "MAIL_PORT: " . config('mail.mailers.smtp.port') . "\n";
echo "MAIL_USERNAME: " . config('mail.mailers.smtp.username') . "\n";
echo "MAIL_FROM: " . config('mail.from.address') . "\n\n";

// Create a mock user object for testing
$mockUser = new User([
    'id' => 999,
    'first_name' => 'Test',
    'middle_name' => 'M',
    'last_name' => 'Resident',
    'email' => $testEmail,
    'username' => 'testuser123',
]);

// Create a mock blotter object for testing
$mockBlotter = new Blotter([
    'id' => 123,
    'incident' => 'Noise Disturbance',
    'date_of_incident' => '2026-02-27',
    'location_of_incident' => 'Purok 1, Barangay II',
    'status' => 'pending',
    'complainant_statement' => 'Test blotter report for notification testing',
    'complainant_resident' => 'John Doe',
]);

echo "Attempting to send test blotter email to: {$testEmail}\n";
echo "Please wait...\n\n";

try {
    // Send notification using the test email
    Notification::route('mail', $testEmail)
        ->notify(new BlotterNotification(
            $mockBlotter, 
            'You have been named as a respondent in a blotter case.'
        ));
    
    echo "✓ SUCCESS! Blotter email sent successfully.\n";
    echo "✓ Check the inbox for: {$testEmail}\n";
    echo "✓ Also check the SPAM/JUNK folder if you don't see it.\n\n";
    
    echo "Email should contain:\n";
    echo "  - Subject: Blotter Case Notification - BLT-000123\n";
    echo "  - Case Number: BLT-000123\n";
    echo "  - Incident Type: Noise Disturbance\n";
    echo "  - Date of Incident\n";
    echo "  - Location\n";
    echo "  - Status: Pending\n";
    echo "  - Action button to view blotter notifications\n\n";
    
} catch (\Exception $e) {
    echo "✗ FAILED! Error sending email:\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    
    if (strpos($e->getMessage(), 'authenticate') !== false) {
        echo "Authentication Error Detected!\n";
        echo "==================================\n";
        echo "Solution:\n";
        echo "1. Verify MAIL_PASSWORD in .env file\n";
        echo "2. Make sure it's a Gmail App Password (no spaces)\n";
        echo "3. Run: php artisan config:clear\n";
        echo "4. Run this test again\n\n";
    }
}

echo "==============================================\n";
echo "Test completed.\n";
echo "==============================================\n";
