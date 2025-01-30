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
        Schema::table('store_page_widgets', function (Blueprint $table) {
            $table->boolean('is_editable')->nullable()->default(true)->after('inputs');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_page_widgets', function (Blueprint $table) {
            $table->dropColumn('is_editable');
        });
    }
};
