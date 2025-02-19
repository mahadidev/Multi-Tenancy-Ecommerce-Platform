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
            $table->unsignedBigInteger('layout_id')->nullable();
            $table->foreignId('theme_id')->nullable()->constrained('themes')->onDelete('cascade');
            $table->string("name");
            $table->string('label')->nullable();
            $table->string('type')->nullable(); 
            $table->string("slug");
            $table->string("title");
            $table->string('thumbnail')->nullable();
            $table->timestamps();

            $table->foreign('layout_id')
                ->references('id')
                ->on('theme_widgets')
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
