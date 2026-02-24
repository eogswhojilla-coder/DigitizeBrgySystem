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
        Schema::table('certificate_requests', function (Blueprint $table) {
            // Payment tracking columns
            $table->string('receipt_path')->nullable()->after('amount_paid');
            $table->enum('payment_status', ['UNPAID', 'FOR_VERIFICATION', 'VERIFIED', 'PAYMENT_REJECTED'])
                ->default('UNPAID')
                ->after('receipt_path');
            $table->foreignId('payment_verified_by')->nullable()->constrained('users')->after('payment_status');
            $table->timestamp('payment_verified_at')->nullable()->after('payment_verified_by');
            $table->string('payment_method')->nullable()->default('GCash')->after('payment_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('certificate_requests', function (Blueprint $table) {
            $table->dropForeign(['payment_verified_by']);
            $table->dropColumn([
                'receipt_path',
                'payment_status',
                'payment_verified_by',
                'payment_verified_at',
                'payment_method'
            ]);
        });
    }
};
