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
        Schema::table('store_page_widget_inputs', function (Blueprint $table) {
            $table->integer('serial')->default(1)->after('label');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_page_widget_inputs', function (Blueprint $table) {
            $table->dropColumn('serial');
        });
    }
};
