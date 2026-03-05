<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First convert any existing string values to integers
        DB::statement("UPDATE inventories SET quantity = CAST(quantity AS UNSIGNED) WHERE quantity IS NOT NULL");
        
        // Then change the column type
        Schema::table('inventories', function (Blueprint $table) {
            $table->integer('quantity')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->string('quantity')->nullable()->change();
        });
    }
};
