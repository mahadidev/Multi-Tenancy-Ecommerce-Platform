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
        Schema::table('expenses', function (Blueprint $table) {
            // Add vendor relationship
            $table->foreignId('vendor_id')->nullable()->after('payment_method')->constrained('vendors')->onDelete('set null');
            
            // Keep the old vendor field for backward compatibility but make it nullable
            $table->string('vendor')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            // Remove vendor relationship
            $table->dropForeign(['vendor_id']);
            $table->dropColumn('vendor_id');
            
            // Restore vendor field as required
            $table->string('vendor')->nullable(false)->change();
        });
    }
};