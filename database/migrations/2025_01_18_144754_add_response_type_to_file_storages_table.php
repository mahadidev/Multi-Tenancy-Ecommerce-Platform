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
        Schema::table('file_storages', function (Blueprint $table) {
            $table->string('response_type')->after('type')->default('url');
            $table->string('width')->after('response_type')->nullable();
            $table->string('height')->after('width')->nullable();
            $table->string('alternate_text')->after('height')->nullable();
            $table->string('tags')->after('height')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('file_storages', function (Blueprint $table) {
            $table->dropColumn(['response_type', 'width', 'height', 'alternate_text', 'tags']);
        });
    }
};
