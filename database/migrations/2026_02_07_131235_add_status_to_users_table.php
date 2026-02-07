<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->after('user_type');
            }
            if (!Schema::hasColumn('users', 'barangay_resident_id')) {
                $table->unsignedBigInteger('barangay_resident_id')->nullable()->after('status');
                $table->foreign('barangay_resident_id')->references('id')->on('barangay_residents')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['barangay_resident_id']);
            $table->dropColumn(['status', 'barangay_resident_id']);
        });
    }
};
