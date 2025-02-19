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
            $table->unsignedBigInteger('widget_type_id')->nullable(); // Add the column after the `id` column
            $table->unsignedBigInteger('theme_page_id');
            $table->string('name');
            $table->string('label')->nullable();
            $table->integer('serial')->default(1);
            $table->longText("inputs")->nullable();
            $table->boolean('is_editable')->nullable()->default(true); 
            $table->string('thumbnail')->nullable();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('theme_page_id')
                ->references('id')->on('theme_pages')
                ->onDelete('cascade');

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
        Schema::dropIfExists('theme_page_widgets');
    }
};
