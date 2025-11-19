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
        
        // Then modify the column to use correct values with PostgreSQL-compatible syntax
        Schema::table('product_stock_histories', function (Blueprint $table) {
            $table->string('type', 255)->default('added')->change();
        });
        
        // Add CHECK constraint for PostgreSQL compatibility
        \DB::statement("ALTER TABLE product_stock_histories ADD CONSTRAINT check_type_values CHECK (type IN ('added', 'deleted', 'adjusted'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert 'adjusted' back to 'edited'
        \DB::table('product_stock_histories')
            ->where('type', 'adjusted')
            ->update(['type' => 'edited']);
            
        // Drop the CHECK constraint
        \DB::statement("ALTER TABLE product_stock_histories DROP CONSTRAINT IF EXISTS check_type_values");
        
        // Revert back to original values with PostgreSQL-compatible syntax
        Schema::table('product_stock_histories', function (Blueprint $table) {
            $table->string('type', 255)->default('added')->change();
        });
        
        // Add CHECK constraint for original values
        \DB::statement("ALTER TABLE product_stock_histories ADD CONSTRAINT check_type_values CHECK (type IN ('added', 'deleted', 'edited'))");
    }
};
