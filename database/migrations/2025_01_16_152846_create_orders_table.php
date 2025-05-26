<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->string('type')->default('system');
            $table->string('source')->default('system');
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('store_id')->nullable()->constrained('stores')->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->decimal('total', 10, 2)->default(0);
            $table->double('discount')->default(0);
            $table->double('vat')->default(0);
            $table->string('status')->default('pending');
            $table->boolean('is_shipped')->default(false); // Removed after() clause
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_closed')->default(false);
            $table->text('notes')->nullable();
            $table->boolean('has_returns')->default(false);
            $table->double('return_total')->default(0);
            $table->string('reason')->nullable();
            $table->boolean('is_payed')->default(false);
            $table->string('payment_method')->default('cash');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
