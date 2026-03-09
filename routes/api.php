<?php

use App\Http\Controllers\AddfamilyMembersController;
use App\Http\Controllers\AdministratorController;
use App\Http\Controllers\AnnouncementCalendarController;
use App\Http\Controllers\BarangayInformationController;
use App\Http\Controllers\BarangayResidentController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\BlotterController;
use App\Http\Controllers\NotificationController;

use App\Http\Controllers\FamiliesController;
use App\Http\Controllers\FamilyMemberController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\InventoriesController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\Api\CertificateRequestController;
use App\Http\Controllers\Api\CertificateTypeController;
use App\Http\Controllers\AnnouncementController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Registration routes (with stricter rate limiting)
Route::post('/register-resident', [RegistrationController::class, 'registerResident'])->middleware('throttle:5,1');

// Account approval routes (admin only - requires permission)
Route::middleware(['auth:sanctum', 'permission:residents.approve'])->group(function () {
    Route::get('/pending-accounts', [RegistrationController::class, 'getPendingAccounts']);
    Route::get('/approved-accounts', [RegistrationController::class, 'getApprovedAccounts']);
    Route::get('/resident-details/{id}', [RegistrationController::class, 'getResidentDetails']);
    Route::post('/approve-account/{id}', [RegistrationController::class, 'approveAccount']);
    Route::post('/reject-account/{id}', [RegistrationController::class, 'rejectAccount']);
    Route::post('/revert-to-pending/{id}', [RegistrationController::class, 'revertToPending']);
    Route::post('/cancel-account/{id}', [RegistrationController::class, 'cancelAccount']);
    Route::post('/set-temporary-resident/{id}', [RegistrationController::class, 'setTemporaryResident']);
});

// Resident Management (Admin only - requires permission)
Route::middleware(['auth:sanctum', 'permission:residents.view'])->group(function () {
    Route::resource('barangay_residents', BarangayResidentController::class);
    Route::resource('barangay_officials', BarangayResidentController::class);
    Route::get('residents/search', [BarangayResidentController::class, 'search']);
    
    // Archived residents
    Route::get('archived_residents', [App\Http\Controllers\ArchivedResidentController::class, 'index']);
    Route::get('archived_residents/generate-pdf', [App\Http\Controllers\ArchivedResidentController::class, 'generatePdf']);
    
    // Official end term
    Route::get('official_end_term/generate-pdf', [App\Http\Controllers\BarangayOfficialEndTermController::class, 'generatePdf']);
});

Route::middleware(['auth:sanctum', 'permission:residents.update'])->group(function () {
    Route::put('barangay_residents/{id}/assign-position', [BarangayResidentController::class, 'assignPosition']);
    Route::post('check-expired-officials', [App\Http\Controllers\BarangayOfficialEndTermController::class, 'checkAndMoveExpiredOfficials']);
    // Archive operations
    Route::post('archived_residents', [App\Http\Controllers\ArchivedResidentController::class, 'store']);
    Route::post('archived_residents/{id}/restore', [App\Http\Controllers\ArchivedResidentController::class, 'restore']);
    // Remove position (revert to resident)
    Route::put('barangay_officials/{id}/remove-position', [BarangayResidentController::class, 'removePosition']);
});

Route::middleware(['auth:sanctum', 'permission:residents.delete'])->group(function () {
    Route::delete('archived_residents/{id}', [App\Http\Controllers\ArchivedResidentController::class, 'destroy']);
});

// Position Management
Route::middleware(['auth:sanctum', 'permission:residents.view'])->group(function () {
    Route::resource('positions', PositionController::class);
});

// Blotter Management (requires permission)
Route::middleware(['auth:sanctum', 'permission:blotter.view'])->group(function () {
    Route::resource('blotters', BlotterController::class);
});

// ============================================
// PUBLIC INVENTORY VIEWING (Residents & Auth Users)
// Must be defined BEFORE resource routes to prevent conflicts
// ============================================
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('inventories/available', [App\Http\Controllers\Api\ResidentController::class, 'getAvailableInventories']);
    Route::get('my-borrow-requests', [App\Http\Controllers\Api\ResidentController::class, 'getMyBorrowRequests']);
});

// Inventory Management (requires permission - Admin only)
Route::middleware(['auth:sanctum', 'permission:inventory.view'])->group(function () {
    Route::resource('inventories', InventoriesController::class);
    
    // Inventory Reports
    Route::get('inventory-reports', [InventoriesController::class, 'getInventoryReports']);
});

// Admin Borrow Request Management (requires permission)
Route::middleware(['auth:sanctum', 'permission:borrow.approve'])->group(function () {
    Route::get('admin/borrow-requests', [InventoriesController::class, 'getAllBorrowRequests']);
    Route::patch('admin/borrow-requests/{id}/approve', [InventoriesController::class, 'approveBorrowRequest']);
    Route::patch('admin/borrow-requests/{id}/decline', [InventoriesController::class, 'declineBorrowRequest']);
});

Route::middleware(['auth:sanctum', 'permission:borrow.return'])->group(function () {
    Route::patch('admin/borrow-requests/{id}/return', [InventoriesController::class, 'markAsReturned']);
});

// Family Management
Route::middleware(['auth:sanctum', 'permission:residents.view'])->group(function () {
    Route::resource('families', FamiliesController::class);
    Route::resource('family_members', FamilyMemberController::class);
    Route::resource('households', HouseholdController::class);
});

// Administrator Management
Route::middleware(['auth:sanctum', 'permission:users.manage'])->group(function () {
    Route::resource('administrator', AdministratorController::class);
    Route::post('administrator/{id}/assign-role', [AdministratorController::class, 'assignRole'])
        ->middleware('permission:roles.manage');
});


// Certificate Types
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // Certificate Type Management (admin only)
    Route::middleware(['permission:certificates.configure_fees'])->group(function () {
        Route::apiResource('certificate-types', CertificateTypeController::class)->except(['index', 'show']);
    });
    
    // Public certificate type viewing (for residents)
    Route::get('certificate-types', [CertificateTypeController::class, 'index']);
    Route::get('certificate-types/{certificate_type}', [CertificateTypeController::class, 'show']);

    // Public announcement viewing (for all authenticated users including residents)
    Route::get('announcement', [AnnouncementController::class, 'index']);
    Route::get('announcement/{announcement}', [AnnouncementController::class, 'show']);
    Route::get('announcement_calendar', [AnnouncementCalendarController::class, 'index']);
    Route::get('announcement_calendar/{announcement_calendar}', [AnnouncementCalendarController::class, 'show']);

    // Announcement Management (admin only - create, update, delete)
    Route::middleware(['permission:announcements.create'])->group(function () {
        Route::post('announcement', [AnnouncementController::class, 'store']);
        Route::put('announcement/{announcement}', [AnnouncementController::class, 'update']);
        Route::delete('announcement/{announcement}', [AnnouncementController::class, 'destroy']);
        Route::post('announcement_calendar', [AnnouncementCalendarController::class, 'store']);
        Route::put('announcement_calendar/{announcement_calendar}', [AnnouncementCalendarController::class, 'update']);
        Route::delete('announcement_calendar/{announcement_calendar}', [AnnouncementCalendarController::class, 'destroy']);
    });

    // Admin Certificate Requests (requires permissions)
    Route::middleware(['permission:certificates.view'])->group(function () {
        Route::get('admin/certificate-requests', [CertificateRequestController::class, 'index']);
        Route::get('admin/certificate-requests/{certificateRequest}', [CertificateRequestController::class, 'show']);
    });
    
    Route::middleware(['permission:certificates.approve'])->group(function () {
        Route::patch('admin/certificate-requests/{certificateRequest}/verify', [CertificateRequestController::class, 'verify']);
        Route::patch('admin/certificate-requests/{certificateRequest}/approve', [CertificateRequestController::class, 'approve']);
    });
    
    Route::middleware(['permission:certificates.reject'])->group(function () {
        Route::patch('admin/certificate-requests/{certificateRequest}/reject', [CertificateRequestController::class, 'reject']);
    });
    
    Route::middleware(['permission:certificates.verify_payment'])->group(function () {
        Route::patch('admin/certificate-requests/{certificateRequest}/verify-payment', [CertificateRequestController::class, 'verifyPayment']);
        Route::patch('admin/certificate-requests/{certificateRequest}/reject-payment', [CertificateRequestController::class, 'rejectPayment']);
    });
    
    Route::middleware(['permission:certificates.generate'])->group(function () {
        Route::get('admin/certificate-requests/{certificateRequest}/print', [CertificateRequestController::class, 'printCertificate']);
        Route::post('certificates/generate-direct', [App\Http\Controllers\Api\CertificateController::class, 'generateDirect']);
    });

    // Certificates (admin viewing)
    Route::middleware(['permission:certificates.view'])->group(function () {
        Route::get('certificates', [App\Http\Controllers\Api\CertificateController::class, 'index']);
        Route::get('certificates/{certificate}', [App\Http\Controllers\Api\CertificateController::class, 'show']);
    });
    
    Route::middleware(['permission:certificates.generate'])->group(function () {
        Route::post('certificates/generate/{certificate}', [App\Http\Controllers\Api\CertificateController::class, 'generate']);
        Route::get('certificates/{certificate}/download', [App\Http\Controllers\Api\CertificateController::class, 'download']);
    });

    // ============================================
    // ADMIN NOTIFICATIONS
    // ============================================
    Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::get('notifications/unread', [NotificationController::class, 'unread']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);
    });

    // ============================================
    // RESIDENT PORTAL APIs (NO PERMISSION CHECKS)
    // ============================================
    Route::middleware(['auth:sanctum', 'role:resident'])->group(function () {
        // Resident Certificate Requests
        Route::get('my-certificate-requests', [App\Http\Controllers\Api\ResidentController::class, 'getMyCertificateRequests']);
        Route::post('certificate-requests', [App\Http\Controllers\Api\ResidentController::class, 'submitCertificateRequest']);
        Route::get('certificate-requests/{certificateRequest}/print', [CertificateRequestController::class, 'printCertificate']);

        // Resident Inventory Borrow - Submit requests only (viewing moved to public section above)
        Route::post('borrow-requests', [App\Http\Controllers\Api\ResidentController::class, 'submitBorrowRequest']);

        // Resident Blotter Notifications
        Route::get('my-blotter-notifications', [App\Http\Controllers\Api\ResidentController::class, 'getMyBlotterNotifications']);
        Route::post('mark-notification-read/{id}', [App\Http\Controllers\Api\ResidentController::class, 'markNotificationAsRead']);
        Route::post('mark-all-notifications-read', [App\Http\Controllers\Api\ResidentController::class, 'markAllNotificationsAsRead']);

        // All Notifications (includes announcements, blotter, etc.)
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::get('notifications/unread', [NotificationController::class, 'unread']);
        Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('notifications/{id}', [NotificationController::class, 'destroy']);

        // Resident Profile
        Route::get('my-profile', [App\Http\Controllers\Api\ResidentController::class, 'getMyProfile']);
        Route::put('my-profile', [App\Http\Controllers\Api\ResidentController::class, 'updateMyProfile']);
        Route::post('change-password', [App\Http\Controllers\Api\ResidentController::class, 'changePassword']);
    });
});
