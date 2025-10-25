<?php

use App\Http\Controllers\AddfamilyMembersController;
use App\Http\Controllers\AdministratorController;
use App\Http\Controllers\BarangayInformationController;
use App\Http\Controllers\BarangayResidentController;
use App\Http\Controllers\BlotterController;

use App\Http\Controllers\FamiliesController;
use App\Http\Controllers\FamilyMemberController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\InventoriesController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\Api\CertificateRequestController;
use App\Http\Controllers\Api\CertificateTypeController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::resource('barangay_residents', BarangayResidentController::class);
Route::resource('positions', PositionController::class);
Route::resource('blotters', BlotterController::class);
Route::resource('inventories', InventoriesController::class);
Route::resource('families', FamiliesController::class);
Route::resource('family_members', FamilyMemberController::class);
Route::resource('administrator', AdministratorController::class);
Route::resource('households', HouseholdController::class);

// Certificate Types
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('certificate-types', CertificateTypeController::class);
    
    // Certificate Requests
    Route::get('certificate-requests', [CertificateRequestController::class, 'index']);
    Route::post('certificate-requests', [CertificateRequestController::class, 'store']);
    Route::get('certificate-requests/{certificateRequest}', [CertificateRequestController::class, 'show']);
    Route::patch('certificate-requests/{certificateRequest}/verify', [CertificateRequestController::class, 'verify']);
    Route::patch('certificate-requests/{certificateRequest}/approve', [CertificateRequestController::class, 'approve']);
    Route::patch('certificate-requests/{certificateRequest}/reject', [CertificateRequestController::class, 'reject']);
    Route::patch('certificate-requests/{certificateRequest}/payment', [CertificateRequestController::class, 'updatePayment']);

    // Direct Certificate Generation
    Route::post('certificates/generate-direct', [App\Http\Controllers\Api\CertificateController::class, 'generateDirect']);

    // Certificates
    Route::get('certificates', [App\Http\Controllers\Api\CertificateController::class, 'index']);
    Route::get('certificates/{certificate}', [App\Http\Controllers\Api\CertificateController::class, 'show']);
    Route::post('certificates/generate/{certificate}', [App\Http\Controllers\Api\CertificateController::class, 'generate']);
    Route::get('certificates/{certificate}/download', [App\Http\Controllers\Api\CertificateController::class, 'download']);
});
