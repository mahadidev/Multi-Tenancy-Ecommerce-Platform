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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->nullable()->constrained('stores')->cascadeOnDelete();
            $table->string('transaction_id')->nullable();
            $table->string('invoice_id')->nullable();
            $table->morphs('payable'); // Allows linking to subscriptions, orders, etc.
            $table->string('name')->nullable();
            $table->string('email', 30)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('payment_method', 20)->default('online');
            $table->double('amount')->nullable();
            $table->string('status', 10)->nullable();
            $table->string('currency', 20)->default('BDT');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
