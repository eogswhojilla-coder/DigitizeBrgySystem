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
        Schema::table('barangay_residents', function (Blueprint $table) {
            if (!Schema::hasColumn('barangay_residents', 'residentId')) {
                $table->string('residentId')->unique()->nullable()->after('id');
            }
            if (!Schema::hasColumn('barangay_residents', 'isOfficial')) {
                $table->boolean('isOfficial')->default(false)->after('id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangay_residents', function (Blueprint $table) {
            $table->dropColumn(['residentId', 'isOfficial']);
        });
    }
};
