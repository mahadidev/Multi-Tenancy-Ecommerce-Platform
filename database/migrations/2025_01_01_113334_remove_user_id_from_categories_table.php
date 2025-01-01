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
            $table->dropForeign(['user_id']); // If `user_id` has a foreign key constraint
            $table->dropColumn('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(); // Add back the column
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Re-add the foreign key if applicable
        });
    }
};
