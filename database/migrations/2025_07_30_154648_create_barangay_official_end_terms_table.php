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
        Schema::create('barangay_official_end_terms', function (Blueprint $table) {
            $table->id();
            $table->string('official_id')->nullable();
            $table->string('position')->nullable();
            $table->string('purok_id')->nullable();
            $table->string('senior')->nullable();
            $table->string('term_from')->nullable();
            $table->string('term_to')->nullable();
            $table->string('pwd')->nullable();
            $table->string('pwd_info')->nullable();
            $table->string('single_parent')->nullable();
            $table->string('status')->nullable();
            $table->string('voters')->nullable();
            $table->string('date_deleted')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangay_official_end_terms');
    }
};
