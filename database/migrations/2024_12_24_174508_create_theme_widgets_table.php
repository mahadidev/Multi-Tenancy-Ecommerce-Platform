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
        Schema::create('theme_widgets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('theme_id');
            $table->string('name');
            $table->string('label')->nullable();
            $table->string('type');
            $table->json('value');
            $table->timestamps();

             // Foreign key constraint
             $table->foreign('theme_id')
             ->references('id')->on('theme_widgets')
             ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theme_widgets');
    }
};
