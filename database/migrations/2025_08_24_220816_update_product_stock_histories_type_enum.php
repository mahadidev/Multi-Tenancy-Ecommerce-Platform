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
        
        // Add CHECK constraint for SQLite compatibility
        \DB::statement("CREATE TRIGGER check_product_stock_histories_type BEFORE INSERT ON product_stock_histories FOR EACH ROW BEGIN SELECT CASE WHEN NEW.type NOT IN ('added', 'deleted', 'adjusted') THEN RAISE(ABORT, 'Invalid type value') END; END;");
        \DB::statement("CREATE TRIGGER check_product_stock_histories_type_update BEFORE UPDATE ON product_stock_histories FOR EACH ROW BEGIN SELECT CASE WHEN NEW.type NOT IN ('added', 'deleted', 'adjusted') THEN RAISE(ABORT, 'Invalid type value') END; END;");
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
            
        // Drop the triggers
        \DB::statement("DROP TRIGGER IF EXISTS check_product_stock_histories_type");
        \DB::statement("DROP TRIGGER IF EXISTS check_product_stock_histories_type_update");
        
        // Revert back to original values with SQLite-compatible syntax
        Schema::table('product_stock_histories', function (Blueprint $table) {
            $table->string('type', 255)->default('added')->change();
        });
        
        // Add triggers for original values
        \DB::statement("CREATE TRIGGER check_product_stock_histories_type_orig BEFORE INSERT ON product_stock_histories FOR EACH ROW BEGIN SELECT CASE WHEN NEW.type NOT IN ('added', 'deleted', 'edited') THEN RAISE(ABORT, 'Invalid type value') END; END;");
        \DB::statement("CREATE TRIGGER check_product_stock_histories_type_update_orig BEFORE UPDATE ON product_stock_histories FOR EACH ROW BEGIN SELECT CASE WHEN NEW.type NOT IN ('added', 'deleted', 'edited') THEN RAISE(ABORT, 'Invalid type value') END; END;");
    }
};
