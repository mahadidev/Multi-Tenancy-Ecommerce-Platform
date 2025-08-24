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
        Schema::create('product_stock_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('set null'); // 🔁 updated here
            $table->unsignedBigInteger('product_stock_id')->nullable();
            $table->foreign('product_stock_id')
                ->references('id')
                ->on('product_stocks')
                ->onDelete('set null'); // 🔁 updated here
            $table->decimal('qty')->default(0);
            $table->decimal('price')->default(0);
            $table->decimal('discount_amount')->default(0);
            $table->decimal('buying_price')->default(0);
            $table->decimal('tax')->default(0);
            $table->string('note')->nullable();
            $table->enum('type', ['added', 'deleted', 'adjusted'])->default('added');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_stock_histories');
    }
};
