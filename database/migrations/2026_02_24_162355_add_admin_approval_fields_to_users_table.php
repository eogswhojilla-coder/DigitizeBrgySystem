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
        Schema::table('users', function (Blueprint $table) {
            $table->text('admin_remarks')->nullable()->after('status');
            $table->unsignedBigInteger('approved_by')->nullable()->after('admin_remarks');
            $table->timestamp('approval_date')->nullable()->after('approved_by');
            
            // Foreign key constraint (assuming admins are also in users table)
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['admin_remarks', 'approved_by', 'approval_date']);
        });
    }
};
