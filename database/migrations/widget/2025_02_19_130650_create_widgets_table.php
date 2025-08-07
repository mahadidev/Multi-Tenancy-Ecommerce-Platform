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
        Schema::create('widgets', function (Blueprint $table) {
            $table->id();
            $table->morphs('ref'); // Creates `ref_id` (bigInteger) and `ref_type` (string)
            $table->string('name');
            $table->string('label');
            $table->integer('serial'); // Unique sorting field
            $table->foreignId('type_id')->constrained('widget_types')->onDelete('cascade'); // Foreign key reference
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widgets');
    }
};
