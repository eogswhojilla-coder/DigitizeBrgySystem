<?php

/**
 * Test script for Account Approval Email Notification
 * Run this with: php test_approval_email.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Notifications\AccountApprovedNotification;
use Illuminate\Support\Facades\Notification;

echo "==============================================\n";
echo "Testing Account Approval Email Notification\n";
echo "==============================================\n\n";

// Test email address - change this to your test email
$testEmail = 'hojilla@csr-scc.edu.ph';

echo "Checking mail configuration...\n";
echo "MAIL_MAILER: " . config('mail.default') . "\n";
echo "MAIL_HOST: " . config('mail.mailers.smtp.host') . "\n";
echo "MAIL_PORT: " . config('mail.mailers.smtp.port') . "\n";
echo "MAIL_USERNAME: " . config('mail.mailers.smtp.username') . "\n";
echo "MAIL_FROM: " . config('mail.from.address') . "\n";
echo "MAIL_ENCRYPTION: " . (config('mail.mailers.smtp.encryption') ?? 'not set') . "\n\n";

// Create a mock user object for testing
$mockUser = new User([
    'id' => 999,
    'first_name' => 'Test',
    'middle_name' => 'User',
    'last_name' => 'Account',
    'email' => $testEmail,
    'username' => 'testuser123',
    'admin_remarks' => 'This is a test approval notification.'
]);

// Don't save to database, just use for testing

echo "Attempting to send test approval email to: {$testEmail}\n";
echo "Please wait...\n\n";

try {
    // Send notification using the test email
    Notification::route('mail', $testEmail)
        ->notify(new AccountApprovedNotification($mockUser, $mockUser->admin_remarks));
    
    echo "✓ SUCCESS! Email sent successfully.\n";
    echo "✓ Check the inbox for: {$testEmail}\n";
    echo "✓ Also check the SPAM/JUNK folder if you don't see it.\n\n";
    
} catch (\Exception $e) {
    echo "✗ FAILED! Error sending email:\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    
    if (strpos($e->getMessage(), 'authenticate') !== false) {
        echo "Authentication Error Detected!\n";
        echo "==================================\n";
        echo "Solution:\n";
        echo "1. Go to https://myaccount.google.com/security\n";
        echo "2. Enable 2-Step Verification\n";
        echo "3. Generate an App Password for Mail\n";
        echo "4. Update MAIL_PASSWORD in .env file with the new App Password\n";
        echo "5. Run this test again\n\n";
    }
}

echo "==============================================\n";
echo "Test completed.\n";
echo "==============================================\n";
