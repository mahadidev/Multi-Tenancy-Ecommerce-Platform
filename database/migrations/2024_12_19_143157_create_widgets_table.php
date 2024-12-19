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
            // Define the group_id column before adding the foreign key constraint
            $table->foreignId('group_id')
                ->constrained('widget_groups')  // Reference the 'widget_groups' table
                ->onDelete('cascade');

            $table->string('meta_title');
            $table->string('meta_name');
            $table->text('meta_value')->nullable();
            $table->enum('field_type', ['text', 'textarea', 'image', 'links']);
            $table->tinyInteger('sorting')->default(0);
            $table->string('placeholder')->nullable();
            $table->text('settings')->nullable(); // For widget-specific settings
            $table->boolean('is_active')->default(true);
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
