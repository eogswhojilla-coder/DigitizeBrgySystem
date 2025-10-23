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
        Schema::create('households', function (Blueprint $table) {
            $table->id();

            // Family link
            $table->string('familyId')->nullable();

            // Income fields
            $table->enum('incomeType', ['bracket', 'numeric'])->nullable();
            $table->string('incomeBracket')->nullable();
            $table->decimal('numericIncome', 12, 2)->nullable();

            // House info
            $table->string('houseType')->nullable();
            $table->integer('numberOfRooms')->nullable();

            // Utilities (booleans to match your React checkboxes)
            $table->boolean('electricity')->default(false);
            $table->boolean('water')->default(false);
            $table->boolean('internet')->default(false);
            $table->boolean('cable')->default(false);
            $table->boolean('landline')->default(false);

            // Sanitation
            $table->string('toiletType')->nullable();
            $table->string('wasteDisposal')->nullable();

            // Notes
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};

// familyId: '',
// //                 incomeType: 'bracket', // 'bracket' or 'numeric'
// //                 incomeBracket: '',
// //                 numericIncome: '',
// //                 houseType: '',
// //                 numberOfRooms: '',
// //                 utilities: {
// //                     electricity: false,
// //                     water: false,
// //                     internet: false,
// //                     cable: false,
// //                     landline: false
// //                 },
// //                 toiletType: '',
// //                 wasteDisposal: '',
// //                 notes: ''