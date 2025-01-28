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
        Schema::table('categories', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->after('id')->nullable(); // Add the `user_id` column after `id`

            // Add a foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->dropUnique(['slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            if (Schema::hasColumn('categories', 'user_id')) {
                $table->dropForeign(['user_id']); // Drop the foreign key if it exists
                $table->dropColumn('user_id');   // Drop the `user_id` column
            }

            if (!Schema::hasColumn('categories', 'slug')) {
                $table->unique('slug'); // Add the unique constraint back to the `slug` column
            }
        });
    }
};
