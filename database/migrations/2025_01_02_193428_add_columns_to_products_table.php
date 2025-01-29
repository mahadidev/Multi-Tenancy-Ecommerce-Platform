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
            $table->foreignId('brand_id')
                ->nullable()
                ->after('has_in_stocks')
                ->constrained('brands') // The name of the table this foreign key references
                ->onDelete('cascade') // Cascade deletes when a referenced record is deleted
                ->onUpdate('cascade');

            $table->boolean('is_trending')->default(false)->after('brand_id');
            $table->boolean('has_discount')->default(false)->after('is_trending');
            
            $table->dateTime('discount_to')->nullable()->after('has_discount');
            $table->string('discount_type',)->nullable()->after('discount_to')->comment('flat/percentage');
            $table->decimal('discount_amount',)->nullable()->after('discount_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['brand_id']);

            // Then drop the columns
            $table->dropColumn(['brand_id', 'is_trending', 'has_discount', 'discount_to', 'discount_type', 'discount_amount']);
        });
    }
};
