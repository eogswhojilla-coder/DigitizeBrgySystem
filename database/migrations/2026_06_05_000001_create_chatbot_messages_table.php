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
        Schema::create('chatbot_messages', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index(); // Track conversation sessions
            $table->text('user_message'); // Message from user
            $table->text('bot_response'); // Response from bot
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Optional: track logged-in users
            $table->string('ip_address')->nullable(); // Track IP for anonymous users
            $table->boolean('is_helpful')->nullable(); // User feedback
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatbot_messages');
    }
};
