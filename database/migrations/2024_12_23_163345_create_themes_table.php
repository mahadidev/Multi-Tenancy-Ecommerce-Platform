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
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); 
            $table->string('slug')->unique(); 
            $table->string('thumbnail')->nullable(); 
            $table->boolean('is_active')->default(true); 
            $table->timestamps();
        });


         // Create the pivot table for themes and widget_groups
         Schema::create('theme_widget_group', function (Blueprint $table) {
            $table->id();
            $table->foreignId('theme_id')
                ->constrained('themes')
                ->onDelete('cascade'); // Ensure cleanup on deletion
            $table->foreignId('widget_group_id')
                ->constrained('widget_groups')
                ->onDelete('cascade'); // Ensure cleanup on deletion
            $table->timestamps(); // Optional: Keep track of the relationship creation
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theme_widget_group');
        Schema::dropIfExists('themes');
    }
};
