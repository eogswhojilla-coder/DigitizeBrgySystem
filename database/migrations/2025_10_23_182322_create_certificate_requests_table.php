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
        Schema::create('certificate_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('certificate_type_id')->constrained()->onDelete('restrict');
            $table->string('request_number')->unique();
            $table->text('purpose');
            $table->enum('source', ['ONLINE', 'WALKIN'])->default('ONLINE');
            $table->enum('status', [
                'PENDING_VERIFICATION',
                'VERIFIED',
                'APPROVED',
                'REJECTED',
                'FOR_RELEASE',
                'RELEASED'
            ])->default('PENDING_VERIFICATION');
            $table->text('remarks')->nullable();
            
            // Tracking fields
            $table->foreignId('verified_by')->nullable()->constrained('users');
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('rejected_by')->nullable()->constrained('users');
            $table->timestamp('rejected_at')->nullable();
            $table->foreignId('released_by')->nullable()->constrained('users');
            $table->timestamp('released_at')->nullable();
            
            $table->boolean('is_paid')->default(false);
            $table->decimal('amount_paid', 8, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificate_requests');
    }
};
