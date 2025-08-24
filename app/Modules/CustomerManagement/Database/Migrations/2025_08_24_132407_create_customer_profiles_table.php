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
        Schema::create('customer_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            
            // Store-specific customer data
            $table->string('display_name')->nullable(); // Store-specific name override
            $table->string('phone')->nullable();        // Store-specific phone override
            $table->text('address')->nullable();        // Store-specific address override
            $table->string('password')->nullable();     // Store-specific password
            $table->timestamp('password_changed_at')->nullable();
            
            // Store-specific customer management
            $table->text('notes')->nullable();          // Store-specific notes
            $table->json('custom_fields')->nullable();  // Store-specific custom data
            $table->enum('status', ['active', 'inactive', 'blocked'])->default('active');
            
            // Store-specific customer metrics
            $table->decimal('total_spent', 10, 2)->default(0);
            $table->integer('total_orders')->default(0);
            $table->timestamp('last_order_at')->nullable();
            
            $table->timestamps();
            
            // Ensure one profile per user per store
            $table->unique(['user_id', 'store_id'], 'customer_profiles_user_store_unique');
            
            // Indexes for better performance
            $table->index(['store_id', 'status']);
            $table->index(['store_id', 'display_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_profiles');
    }
};