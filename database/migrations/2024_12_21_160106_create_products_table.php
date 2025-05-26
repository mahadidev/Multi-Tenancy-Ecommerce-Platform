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
            $table->foreignId('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->foreignId('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreignId('brand_id')->nullable()->references('id')->on('categories')->onDelete('cascade');

            $table->string('name');
            $table->string('slug');
            $table->string('sku')->nullable(); // Stock keeping unit
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->text('thumbnail')->nullable();
            $table->json('attachments')->nullable();
            $table->decimal('cost_price', 10, 2)->nullable(); // Nullable if the product has variants
            $table->decimal('price', 10, 2)->nullable(); // Nullable if the product has variants
            $table->integer('stock')->nullable(); // Nullable if the product has variants
            $table->boolean('has_variants')->default(false);
            $table->boolean('has_in_stocks')->default(true); // Nullable for products with variants
            $table->boolean('status')->default(true); // 'true', 'false'
            $table->boolean('is_trending')->default(false);
            $table->boolean('has_discount')->default(false);
            $table->dateTime('discount_to')->nullable();
            $table->string('discount_type',)->nullable()->comment('flat/percentage');
            $table->decimal('discount_amount',)->nullable();
            $table->integer("tax")->nullable()->default(0);
            $table->string("barcode")->unique()->nullable();
            $table->boolean('is_featured')->default(false)->after('is_trending');
            $table->timestamps();


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
