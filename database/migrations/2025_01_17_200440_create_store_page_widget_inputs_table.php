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
        Schema::create('store_page_widget_inputs', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("label");
            $table->string("placeholder")->nullable();
            $table->string("value")->nullable();
            $table->boolean("required")->default(0)->nullable();
            $table->string("type")->nullable();
            $table->foreignId('widget_id')->constrained('store_page_widgets')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_page_widget_inputs');
    }
};
