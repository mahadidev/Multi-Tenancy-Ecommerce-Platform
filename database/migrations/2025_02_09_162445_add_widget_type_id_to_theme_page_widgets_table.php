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
        Schema::table('theme_page_widgets', function (Blueprint $table) {
            $table->unsignedBigInteger('widget_type_id')->nullable()->after('id'); // Add the column after the `id` column

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
        Schema::table('theme_page_widgets', function (Blueprint $table) {
             // Drop the foreign key first
             $table->dropForeign(['widget_type_id']);

             // Then drop the column
             $table->dropColumn('widget_type_id');
        });
    }
};
