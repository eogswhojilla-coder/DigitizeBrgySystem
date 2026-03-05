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
        Schema::create('archived_residents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('barangay_residents')->onDelete('cascade');
            
            // Archive information
            $table->enum('archive_reason', [
                'moved_out',
                'passed_away',
                'duplicate_entry',
                'lost_jurisdiction',
                'inactive_years'
            ]);
            $table->text('archive_notes')->nullable();
            $table->date('archive_date');
            $table->string('archived_by')->nullable();
            
            // Store snapshot of resident data at time of archiving
            $table->string('resident_number')->nullable();
            $table->string('full_name')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            $table->boolean('was_official')->default(false);
            $table->string('position_held')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archived_residents');
    }
};
