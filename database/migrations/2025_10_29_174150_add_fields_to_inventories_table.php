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
        Schema::table('inventories', function (Blueprint $table) {
            if (!Schema::hasColumn('inventories', 'category')) {
                $table->string('category')->nullable()->after('name');
            }
            if (!Schema::hasColumn('inventories', 'borrowed')) {
                $table->integer('borrowed')->default(0)->after('status');
            }
            if (!Schema::hasColumn('inventories', 'damaged')) {
                $table->integer('damaged')->default(0)->after('borrowed');
            }
            if (!Schema::hasColumn('inventories', 'minimum_quantity')) {
                $table->integer('minimum_quantity')->default(5)->after('damaged');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventories', function (Blueprint $table) {
            $table->dropColumn(['category', 'borrowed', 'damaged', 'minimum_quantity']);
        });
    }
};
