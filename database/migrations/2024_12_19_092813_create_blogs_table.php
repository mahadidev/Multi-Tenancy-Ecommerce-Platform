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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('category_id');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('image');
            $table->text('content');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        
            // Adding foreign key constraints with cascading behavior
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade'); // Cascade on delete
        
            $table->foreign('category_id')
                  ->references('id')->on('categories')
                  ->onDelete('cascade'); // Cascade on delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
