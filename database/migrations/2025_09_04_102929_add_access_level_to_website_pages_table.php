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
        Schema::table('website_pages', function (Blueprint $table) {
            $table->enum('access_level', ['all', 'guest', 'user'])->default('all')->after('is_homepage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('website_pages', function (Blueprint $table) {
            $table->dropColumn('access_level');
        });
    }
};
