<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Announcement files - stores base64 image data
        Schema::table('announcement_files', function (Blueprint $table) {
            $table->longText('files')->change();
        });

        // Barangay residents - profile image
        Schema::table('barangay_residents', function (Blueprint $table) {
            $table->longText('profileImage')->nullable()->change();
        });

        // Barangay highlights - image
        Schema::table('barangay_highlights', function (Blueprint $table) {
            $table->longText('image')->nullable()->change();
        });

        // Inventories - gcash QR code
        Schema::table('inventories', function (Blueprint $table) {
            $table->longText('gcash_qr')->nullable()->change();
        });

        // Certificate types - gcash QR code
        Schema::table('certificate_types', function (Blueprint $table) {
            $table->longText('gcash_qr')->nullable()->change();
        });

        // Certificate requests - valid ID and receipt
        Schema::table('certificate_requests', function (Blueprint $table) {
            $table->longText('valid_id_path')->nullable()->change();
            $table->longText('receipt_path')->nullable()->change();
        });

        // Borrow requests - payment receipt
        Schema::table('borrow_requests', function (Blueprint $table) {
            $table->longText('payment_receipt')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('announcement_files', function (Blueprint $table) {
            $table->string('files')->change();
        });

        Schema::table('barangay_residents', function (Blueprint $table) {
            $table->string('profileImage')->nullable()->change();
        });

        Schema::table('barangay_highlights', function (Blueprint $table) {
            $table->string('image')->nullable()->change();
        });

        Schema::table('inventories', function (Blueprint $table) {
            $table->string('gcash_qr')->nullable()->change();
        });

        Schema::table('certificate_types', function (Blueprint $table) {
            $table->string('gcash_qr')->nullable()->change();
        });

        Schema::table('certificate_requests', function (Blueprint $table) {
            $table->string('valid_id_path')->nullable()->change();
            $table->string('receipt_path')->nullable()->change();
        });

        Schema::table('borrow_requests', function (Blueprint $table) {
            $table->string('payment_receipt')->nullable()->change();
        });
    }
};
