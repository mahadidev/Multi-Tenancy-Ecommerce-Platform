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
        Schema::create('store_page_widgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_page_id')->constrained('store_pages')->onDelete('cascade');
            $table->string('name');
            $table->string('label')->nullable();
            $table->longText("inputs")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_page_widgets');
    }
};
