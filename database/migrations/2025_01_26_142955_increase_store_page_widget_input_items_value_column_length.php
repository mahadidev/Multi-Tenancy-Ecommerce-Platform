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
        Schema::table('store_page_widget_input_items', function (Blueprint $table) {
            $table->string('value')->nullable()->change();
        });
    }
};
