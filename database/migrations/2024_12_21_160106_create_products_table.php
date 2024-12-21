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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('category_id');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->nullable(); // Stock keeping unit
            $table->text('description')->nullable();
            $table->text('thumbnail')->nullable();
            $table->json('attachments')->nullable();
            $table->decimal('cost_price', 10, 2)->nullable(); // Nullable if the product has variants
            $table->decimal('price', 10, 2)->nullable(); // Nullable if the product has variants
            $table->integer('stock')->nullable(); // Nullable if the product has variants
            $table->boolean('has_variants')->default(false);
            $table->boolean('has_in_stocks')->default(true); // Nullable for products with variants
            $table->boolean('status')->default(true); // 'true', 'false'
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('store_id')
                ->references('id')->on('stores')
                ->onDelete('cascade');
            $table->foreign('category_id')
                ->references('id')->on('categories')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
