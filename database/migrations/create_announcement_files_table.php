<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcement_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_feed_id')->constrained('announcements')->onDelete('cascade');
            $table->string('files'); // URL to the file
            $table->string('type')->default('announcement');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcement_files');
    }
};