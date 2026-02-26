<?php

use App\Http\Controllers\AddfamilyMembersController;
use App\Http\Controllers\AdministratorController;
use App\Http\Controllers\AnnouncementCalendarController;
use App\Http\Controllers\BarangayInformationController;
use App\Http\Controllers\BarangayResidentController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\BlotterController;

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

// Account approval routes (admin only)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/pending-accounts', [RegistrationController::class, 'getPendingAccounts']);
    Route::get('/resident-details/{id}', [RegistrationController::class, 'getResidentDetails']);
    Route::post('/approve-account/{id}', [RegistrationController::class, 'approveAccount']);
    Route::post('/reject-account/{id}', [RegistrationController::class, 'rejectAccount']);
    Route::post('/set-temporary-resident/{id}', [RegistrationController::class, 'setTemporaryResident']);
});

Route::resource('barangay_residents', BarangayResidentController::class);
Route::resource('barangay_officials', BarangayResidentController::class);
Route::get('residents/search', [BarangayResidentController::class, 'search']);
Route::put('barangay_residents/{id}/assign-position', [BarangayResidentController::class, 'assignPosition']);
Route::resource('positions', PositionController::class);
Route::resource('blotters', BlotterController::class);
Route::resource('inventories', InventoriesController::class);
Route::resource('families', FamiliesController::class);
Route::resource('family_members', FamilyMemberController::class);
Route::resource('administrator', AdministratorController::class);
Route::resource('households', HouseholdController::class);


// Certificate Types
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::apiResource('certificate-types', CertificateTypeController::class);

    Route::resource('announcement', AnnouncementController::class);
    Route::resource('announcement_calendar', AnnouncementCalendarController::class);

    // Admin Certificate Requests
    Route::get('admin/certificate-requests', [CertificateRequestController::class, 'index']);
    Route::get('admin/certificate-requests/{certificateRequest}', [CertificateRequestController::class, 'show']);
    Route::patch('admin/certificate-requests/{certificateRequest}/verify', [CertificateRequestController::class, 'verify']);
    Route::patch('admin/certificate-requests/{certificateRequest}/approve', [CertificateRequestController::class, 'approve']);
    Route::patch('admin/certificate-requests/{certificateRequest}/reject', [CertificateRequestController::class, 'reject']);
    Route::patch('admin/certificate-requests/{certificateRequest}/verify-payment', [CertificateRequestController::class, 'verifyPayment']);
    Route::patch('admin/certificate-requests/{certificateRequest}/reject-payment', [CertificateRequestController::class, 'rejectPayment']);
    Route::get('admin/certificate-requests/{certificateRequest}/print', [CertificateRequestController::class, 'printCertificate']);

    // Direct Certificate Generation
    Route::post('certificates/generate-direct', [App\Http\Controllers\Api\CertificateController::class, 'generateDirect']);

    // Certificates
    Route::get('certificates', [App\Http\Controllers\Api\CertificateController::class, 'index']);
    Route::get('certificates/{certificate}', [App\Http\Controllers\Api\CertificateController::class, 'show']);
    Route::post('certificates/generate/{certificate}', [App\Http\Controllers\Api\CertificateController::class, 'generate']);
    Route::get('certificates/{certificate}/download', [App\Http\Controllers\Api\CertificateController::class, 'download']);

    // Resident Portal APIs
    // Note: certificate-types is already available via apiResource above (CertificateTypeController::index)
    Route::get('my-certificate-requests', [App\Http\Controllers\Api\ResidentController::class, 'getMyCertificateRequests']);
    Route::post('certificate-requests', [App\Http\Controllers\Api\ResidentController::class, 'submitCertificateRequest']);
    Route::get('certificate-requests/{certificateRequest}/print', [CertificateRequestController::class, 'printCertificate']);

    // Resident Inventory Borrow APIs
    Route::get('inventories/available', [App\Http\Controllers\Api\ResidentController::class, 'getAvailableInventories']);
    Route::get('my-borrow-requests', [App\Http\Controllers\Api\ResidentController::class, 'getMyBorrowRequests']);
    Route::post('borrow-requests', [App\Http\Controllers\Api\ResidentController::class, 'submitBorrowRequest']);

    // Resident Blotter Notifications
    Route::get('my-blotter-notifications', [App\Http\Controllers\Api\ResidentController::class, 'getMyBlotterNotifications']);
    Route::post('mark-notification-read/{id}', [App\Http\Controllers\Api\ResidentController::class, 'markNotificationAsRead']);
    Route::post('mark-all-notifications-read', [App\Http\Controllers\Api\ResidentController::class, 'markAllNotificationsAsRead']);

    // Resident Profile
    Route::get('my-profile', [App\Http\Controllers\Api\ResidentController::class, 'getMyProfile']);
    Route::put('my-profile', [App\Http\Controllers\Api\ResidentController::class, 'updateMyProfile']);
});
