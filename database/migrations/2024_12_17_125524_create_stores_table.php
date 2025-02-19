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
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_type_id')->references('id')->on('store_types')->onDelete('cascade');
            $table->foreignId('owner_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('name');
            $table->string('slug');
            $table->string('domain')->unique();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('location')->nullable();
            $table->string('currency')->default('BDT'); 
            $table->string('logo')->nullable(); 
            $table->string('dark_logo')->nullable();
            $table->unsignedBigInteger('theme_id')->nullable();
            $table->string('primary_color')->nullable();
            $table->string('secondary_color')->nullable();
            $table->json('settings')->nullable();
            $table->longText('description')->nullable();
            $table->tinyInteger('status')->default(1);
           
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
