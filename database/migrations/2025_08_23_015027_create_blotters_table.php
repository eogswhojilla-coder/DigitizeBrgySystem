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
        Schema::create('blotters', function (Blueprint $table) {
            $table->id();

            $table->string('complainant_resident')->nullable();
            $table->string('complainant_not_resident')->nullable();
            $table->string('complainant_statement')->nullable();
            $table->string('respondent')->nullable();
            $table->string('person_involved_resident')->nullable();
            $table->string('person_involved_not_resident')->nullable();
            $table->string('person_statement')->nullable();
            $table->string('location_of_incident')->nullable();
            $table->string('date_of_incident')->nullable();
            $table->string('incident')->nullable();
            $table->string('status')->nullable();
            $table->string('date_reported')->nullable();
            $table->string('remarks')->nullable();

        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blotters');
    }
};
// complainant_resident
// complainant_not_resident
// complainant_statement
// respondent
// person_involved_resident
// person_involved_not_resident
// person_statement
// location_of_incident
// date_of_incident
// incident
// status
// date_reported
// remarks