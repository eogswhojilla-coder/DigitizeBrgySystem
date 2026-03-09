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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('category')->nullable();        // ✅ Add this
            $table->string('description')->nullable();
            $table->string('quantity')->nullable();
            $table->string('condition')->nullable();
            $table->string('location')->nullable();
            $table->string('status')->nullable();
            $table->integer('borrowed')->default(0);       // ✅ Add this
            $table->integer('damaged')->default(0);        // ✅ Add this
            $table->integer('minimum_quantity')->default(5); // ✅ Add this
            $table->longText('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};

