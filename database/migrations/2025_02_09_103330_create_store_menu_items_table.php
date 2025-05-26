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
        Schema::create('store_menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('label')->nullable(false);
            $table->string('href')->nullable(false);
            $table->unsignedBigInteger('store_menu_id');
            $table->enum('visibility', ['user', 'guest', 'all'])->default('all');
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('store_menu_id')
                ->references('id')
                ->on('store_menus')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_menu_items');
    }
};
