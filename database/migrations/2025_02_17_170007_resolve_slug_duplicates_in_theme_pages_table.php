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
        Schema::table('theme_pages', function (Blueprint $table) {
            $duplicates = DB::table('theme_pages')
            ->select('slug')
            ->groupBy('slug')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('slug');

        foreach ($duplicates as $slug) {
            DB::table('theme_pages')
                ->where('slug', $slug)
                ->orderBy('id')
                ->skip(1)
                ->take(PHP_INT_MAX)
                ->delete();
        }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('theme_pages', function (Blueprint $table) {
            // No need to reverse the changes
        });
    }
};
