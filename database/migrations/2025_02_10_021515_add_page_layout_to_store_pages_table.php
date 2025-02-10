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
        Schema::table('store_pages', function (Blueprint $table) {
            $table->unsignedBigInteger('layout_id')->nullable()->after('id');
            $table->foreign('layout_id')
                ->references('id')
                ->on('theme_widgets')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_pages', function (Blueprint $table) {
            //
        });
    }
};
