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
            $table->string('purokSitio')->nullable()->after('address');
            $table->string('subdivision')->nullable()->after('purokSitio');
            $table->string('province')->nullable()->after('subdivision');
            $table->string('residencyStatus')->nullable()->after('province');
            $table->string('residencyStatusOther')->nullable()->after('residencyStatus');
            $table->date('dateStartedLiving')->nullable()->after('residencyStatusOther');
            $table->text('permanentAddress')->nullable()->after('dateStartedLiving');
            $table->enum('residentType', ['official', 'temporary'])->nullable()->after('permanentAddress');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barangay_residents', function (Blueprint $table) {
            $table->dropColumn([
                'purokSitio',
                'subdivision',
                'province',
                'residencyStatus',
                'residencyStatusOther',
                'dateStartedLiving',
                'permanentAddress',
                'residentType'
            ]);
        });
    }
};
