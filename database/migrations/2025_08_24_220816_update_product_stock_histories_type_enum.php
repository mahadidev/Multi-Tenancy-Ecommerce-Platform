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
        // First update any existing 'edited' values to 'adjusted'
        \DB::table('product_stock_histories')
            ->where('type', 'edited')
            ->update(['type' => 'adjusted']);
        
        // Then modify the enum column to use correct values
        Schema::table('product_stock_histories', function (Blueprint $table) {
            $table->enum('type', ['added', 'deleted', 'adjusted'])->default('added')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        Schema::table('product_stock_histories', function (Blueprint $table) {
            $table->enum('type', ['added', 'deleted', 'edited'])->default('added')->change();
        });
        
        // Convert 'adjusted' back to 'edited'
        \DB::table('product_stock_histories')
            ->where('type', 'adjusted')
            ->update(['type' => 'edited']);
    }
};
