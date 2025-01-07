<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            // Drop the existing foreign key on product_id
            $table->dropForeign(['product_id']);

            // Re-add the foreign key with onDelete('cascade')
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            // Drop the updated foreign key
            $table->dropForeign(['product_id']);

            // Re-add the original foreign key without onDelete('cascade')
            $table->foreign('product_id')->references('id')->on('products');
        });
    }
};
