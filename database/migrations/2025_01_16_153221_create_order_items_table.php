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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable();
            $table->foreignId('product_id')->nullable()->constrained('products')->cascadeOnDelete();
            $table->foreignId('store_id')->nullable()->constrained('stores')->cascadeOnDelete();
            $table->string('item')->nullable();
            $table->decimal('price', 8,2)->default(0);
            $table->decimal('discount', 8,2)->default(0);
            $table->decimal('discount_amount', 8, 2)->default(0);
            $table->double('vat')->default(0);
            $table->decimal('total', 8,2)->default(0);
            $table->double('returned')->default(0);
            $table->integer('qty')->default(1);
            $table->string('code')->nullable();
            $table->double('returned_qty')->default(0);
            $table->boolean('is_free')->default(false);
            $table->boolean('is_returned')->default(false);
            $table->json('options')->nullable();
            $table->integer("taxAmount")->default(0);
            $table->integer("afterTaxTotalPrice")->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
