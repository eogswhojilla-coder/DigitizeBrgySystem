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
            $table->dropColumn('purokSitio');
            $table->renameColumn('subdivision', 'zone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangay_residents', function (Blueprint $table) {
            $table->renameColumn('zone', 'subdivision');
            $table->string('purokSitio')->nullable()->after('street');
        });
    }
};
