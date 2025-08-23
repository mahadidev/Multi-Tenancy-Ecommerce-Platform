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
        // First drop the existing table if it exists with the old structure
        if (Schema::hasTable('expenses')) {
            Schema::drop('expenses');
        }
        
        // Create the expenses table with proper structure
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('reason')->nullable(); // Keep for backward compatibility
            $table->string('category')->default('general');
            $table->enum('payment_method', ['cash', 'card', 'bank_transfer', 'check', 'other'])->default('cash');
            $table->string('vendor')->nullable();
            $table->string('receipt_number')->nullable();
            $table->date('expense_date')->default(DB::raw('CURRENT_DATE'));
            $table->string('status', 20)->default('approved');
            $table->json('attachments')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index('store_id');
            $table->index(['store_id', 'expense_date']);
            $table->index(['store_id', 'category']);
            
            // Note: We'll add foreign keys in a separate statement to avoid issues
        });
        
        // Try to add foreign key constraints if the referenced tables exist
        if (Schema::hasTable('stores')) {
            try {
                Schema::table('expenses', function (Blueprint $table) {
                    $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
                });
            } catch (\Exception $e) {
                // If foreign key fails, continue without it
                \Log::warning('Could not add foreign key for store_id in expenses table: ' . $e->getMessage());
            }
        }
        
        if (Schema::hasTable('users')) {
            try {
                Schema::table('expenses', function (Blueprint $table) {
                    $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
                });
            } catch (\Exception $e) {
                // If foreign key fails, continue without it
                \Log::warning('Could not add foreign key for user_id in expenses table: ' . $e->getMessage());
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};