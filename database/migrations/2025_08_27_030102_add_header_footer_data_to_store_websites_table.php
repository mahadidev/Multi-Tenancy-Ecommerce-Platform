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
        Schema::table('store_websites', function (Blueprint $table) {
            $table->json('header_data')->nullable()->after('analytics_settings');
            $table->json('footer_data')->nullable()->after('header_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_websites', function (Blueprint $table) {
            $table->dropColumn(['header_data', 'footer_data']);
        });
    }
};
