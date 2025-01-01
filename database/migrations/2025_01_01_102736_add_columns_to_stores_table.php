<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('currency')->after('location')->default('BDT'); 
            $table->string('logo')->after('currency')->nullable(); 
        });
    }
    
    public function down()
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn(['currency', 'logo']);
        });
    }
};