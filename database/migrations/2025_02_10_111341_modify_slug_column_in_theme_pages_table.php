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
        Schema::table('theme_pages', function (Blueprint $table) {
            $table->dropUnique(['slug']); // Remove the unique constraint
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('theme_pages', function (Blueprint $table) {
            $table->unique('slug'); // Add the unique constraint back
        });
    }
};
