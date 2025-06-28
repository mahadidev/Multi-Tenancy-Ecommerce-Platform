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
        Schema::create('product_variant_stock_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variant_stock_id')->nullable();
            $table->foreign('variant_stock_id')->references('id')->on('product_variant_stocks')->onDelete('cascade');
            $table->unsignedBigInteger('variant_option_id')->nullable();
            $table->foreign('variant_option_id')->references('id')->on('product_variant_options')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variant_stock_items');
    }
};
