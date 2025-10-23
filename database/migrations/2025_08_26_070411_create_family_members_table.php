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
        Schema::create('family_members', function (Blueprint $table) {
            $table->id();
            $table->string('family_id')->nullable();
            $table->string('residentId')->nullable();
            $table->string('isExistingResident')->nullable();
            $table->string('newResidentName')->nullable();
            $table->string('relationship')->nullable();
            $table->string('role')->nullable();
            $table->string('searchTerm')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_members');
    }
};
