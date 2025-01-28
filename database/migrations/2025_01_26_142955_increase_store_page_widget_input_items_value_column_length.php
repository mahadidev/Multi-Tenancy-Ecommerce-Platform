<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up()
    {
        Schema::table('store_page_widget_input_items', function (Blueprint $table) {
            $table->text('value')->nullable()->change();
        });
    }

    public function down()
    {
        // Truncate any oversized data
        DB::table('store_page_widget_input_items')
            ->whereRaw('CHAR_LENGTH(value) > 255')
            ->update(['value' => DB::raw('LEFT(value, 255)')]);

        // Change the column back to string
        Schema::table('store_page_widget_input_items', function (Blueprint $table) {
            $table->string('value', 255)->nullable()->change();
        });
    }
};
