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
        Schema::table('stores', function (Blueprint $table) {
            $table->string('type')->nullable()->after('settings');
            $table->longText('description')->nullable()->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('brands', function (Blueprint $table) {
            // Drop the foreign key constraint referencing `stores`
            $table->dropForeign(['store_id']);
        });

        Schema::table('stores', function (Blueprint $table) {
            // Drop the `type` and `description` columns from `stores`
            $table->dropColumn(['type', 'description']);
        });
    }
};
