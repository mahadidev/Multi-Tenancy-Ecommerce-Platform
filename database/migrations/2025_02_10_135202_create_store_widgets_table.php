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
        Schema::create('store_widgets', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('store_id');
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');

            $table->unsignedBigInteger('widget_type_id');
            $table->foreign('widget_type_id')->references('id')->on('widget_types')->onDelete('cascade');
            $table->string('name');
            $table->string('label')->nullable();
            $table->longText('inputs')->nullable();
            $table->boolean('is_editable')->nullable()->default(true);
            $table->string('thumbnail')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_widgets');
    }
};
