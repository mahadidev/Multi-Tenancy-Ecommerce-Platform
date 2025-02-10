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
        Schema::table('store_menus', function (Blueprint $table) {
            $table->enum('visibility', ['user', 'guest', 'all'])->default('all')->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('store_menus', function (Blueprint $table) {
            $table->dropColumn('visibility');
        });
    }
};
