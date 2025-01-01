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
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_trending')->default(false)->after('has_in_stocks'); // Replace 'column_name' with the last column in your table
            $table->boolean('has_discount')->default(false)->after('is_trending');
            $table->dateTime('discount_to')->nullable()->after('has_discount');
            $table->double('discount', 8, 2)->default(0)->after('discount_to');
            $table->unsignedBigInteger('brand_id')->nullable()->after('discount');
            $table->foreign('brand_id')->references('id')->on('stores')->onDelete('cascade'); // Assuming you have a `brands` table
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('is_trending');
            $table->dropColumn('has_discount');
            $table->dropColumn('discount_to');
            $table->dropColumn('discount');
            $table->dropForeign(['brand_id']);
            $table->dropColumn('brand_id');
        });
    }
};
