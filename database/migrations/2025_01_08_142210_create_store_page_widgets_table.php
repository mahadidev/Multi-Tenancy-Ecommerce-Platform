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
            $table->unsignedBigInteger('widget_type_id')->nullable(); // Add the column after the `id` column
            $table->foreignId('store_page_id')->constrained('store_pages')->onDelete('cascade');
            $table->string('name');
            $table->string('label')->nullable();
            $table->tinyInteger('serial')->default(1);
            $table->longText("inputs")->nullable();
            $table->boolean('is_editable')->nullable()->default(true);
            $table->timestamps();


            // Add the foreign key constraint with cascade on delete
            $table->foreign('widget_type_id')
                ->references('id')
                ->on('widget_types')
                ->onDelete('cascade');

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
