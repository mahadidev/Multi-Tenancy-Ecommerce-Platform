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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->string('name'); 
            $table->string('sku')->nullable(); 
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->decimal('cost_price', 10, 2); 
            $table->decimal('price', 10, 2); 
            $table->integer('stock')->nullable(); // Stock specific to the variant
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('product_id')
                ->references('id')->on('products')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
