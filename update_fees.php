<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Updating certificate types with fees...\n\n";

// Update Barangay Clearance
$updated = DB::table('certificate_types')
    ->where('name', 'LIKE', '%Barangay Clearance%')
    ->orWhere('name', 'LIKE', '%barangay clearance%')
    ->update([
        'has_fee' => true,
        'fee' => 50.00
    ]);

echo "Updated Barangay Clearance: $updated row(s)\n";

// Update other common certificate types
$types = [
    ['pattern' => '%Certificate of Residency%', 'fee' => 30.00],
    ['pattern' => '%Residency%', 'fee' => 30.00],
    ['pattern' => '%Business%', 'fee' => 75.00],
    ['pattern' => '%Barangay ID%', 'fee' => 100.00],
];

foreach ($types as $type) {
    $updated = DB::table('certificate_types')
        ->where('name', 'LIKE', $type['pattern'])
        ->update([
            'has_fee' => true,
            'fee' => $type['fee']
        ]);
    
    if ($updated > 0) {
        echo "Updated " . str_replace('%', '', $type['pattern']) . ": $updated row(s)\n";
    }
}

// Update Indigency to be free
$updated = DB::table('certificate_types')
    ->where('name', 'LIKE', '%Indigency%')
    ->update([
        'has_fee' => false,
        'fee' => 0.00
    ]);

if ($updated > 0) {
    echo "Updated Indigency (FREE): $updated row(s)\n";
}

echo "\n";
echo "Current certificate types:\n";
echo "==========================\n";

$types = DB::table('certificate_types')
    ->select('id', 'name', 'has_fee', 'fee')
    ->get();

foreach ($types as $type) {
    $feeStatus = $type->has_fee ? "₱" . number_format($type->fee, 2) : "FREE";
    echo sprintf("%-5d %-40s %s\n", $type->id, $type->name, $feeStatus);
}

echo "\nDone!\n";
