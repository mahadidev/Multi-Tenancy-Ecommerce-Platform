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
        Schema::table('product_create_histories', function (Blueprint $table) {
            // Drop the existing foreign key first
            $table->dropForeign(['product_id']);

            // Re-add the foreign key with cascading delete
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade'); // Change to 'set null' if needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_create_histories', function (Blueprint $table) {
            // Rollback: drop the cascading foreign key
            $table->dropForeign(['product_id']);

            // Re-add the original foreign key without cascading delete
            $table->foreign('product_id')
                ->references('id')
                ->on('products');
        });
    }
};
