<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('theme_pages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('theme_id');
            $table->string("name");
            $table->string("slug");
            $table->string("title");
            $table->timestamps();


            // Foreign key constraint
            $table->foreign('theme_id')
                ->references('id')->on('themes')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theme_pages');
    }
};
