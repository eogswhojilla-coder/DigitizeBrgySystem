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
        Schema::create('barangay_residents', function (Blueprint $table) {
            $table->id();
            $table->string('profileImage')->nullable();
            $table->string('position')->nullable();
            $table->string('startDate')->nullable();
            $table->string('endDate')->nullable();
            $table->string('voters')->nullable();
            $table->string('dateOfBirth')->nullable();
            $table->string('placeOfBirth')->nullable();
            $table->string('pwd')->nullable();
            $table->string('singleParent')->nullable();
            $table->string('firstName')->nullable();
            $table->string('middleName')->nullable();
            $table->string('lastName')->nullable();
            $table->string('suffix')->nullable();
            $table->string('gender')->default('Male')->nullable();
            $table->string('civilStatus')->default('Single')->nullable();
            $table->string('religion')->nullable();
            $table->string('nationality')->nullable();

            // Other Info (Address)
            $table->string('municipality')->nullable();
            $table->string('zip')->nullable();
            $table->string('barangay')->nullable();
            $table->string('houseNumber')->nullable();
            $table->string('street')->nullable();
            $table->string('address')->nullable();
            $table->string('contactNumber')->nullable();
            $table->string('emailAddress')->nullable();

            // Guardian
            $table->string('fatherName')->nullable();
            $table->string('motherName')->nullable();
            $table->string('guardianName')->nullable();
            $table->string('guardianContact')->nullable();

            // Account
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->string('confirmPassword')->nullable();

            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_residents');
    }
};
