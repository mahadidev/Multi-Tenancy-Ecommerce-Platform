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
        Schema::create('theme_page_widgets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('theme_page_id');
            $table->string('name');
            $table->string('label')->nullable();
            $table->integer('serial')->default(1);
            $table->longText("inputs")->nullable();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('theme_page_id')
                ->references('id')->on('theme_pages')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('theme_page_widgets');
    }
};
