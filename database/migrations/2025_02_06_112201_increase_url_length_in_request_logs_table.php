<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('request_logs', function (Blueprint $table) {
            $table->text('url')->change(); // Use TEXT for unlimited length
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("UPDATE request_logs SET url = LEFT(url, 255) WHERE CHAR_LENGTH(url) > 255;");
    
        Schema::table('request_logs', function (Blueprint $table) {
            $table->string('url', 255)->change();
        });
    }
};
