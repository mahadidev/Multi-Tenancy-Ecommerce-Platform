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
            $table->tinyInteger('serial')->default(1)->after('label');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_page_widgets', function (Blueprint $table) {
            if (Schema::hasColumn('store_page_widgets', 'serial')) {
                $table->dropColumn('serial');
            }
        });
    }
};
