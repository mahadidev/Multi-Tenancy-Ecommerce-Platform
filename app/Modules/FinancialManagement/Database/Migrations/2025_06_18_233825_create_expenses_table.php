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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('user_id'); // Who created the expense
            $table->string('title'); // Expense title/name
            $table->text('description')->nullable(); // Detailed description
            $table->decimal('amount', 10, 2); // Expense amount
            $table->string('category')->default('general'); // Expense category
            $table->enum('payment_method', ['cash', 'card', 'bank_transfer', 'check', 'other'])->default('cash');
            $table->string('vendor')->nullable(); // Vendor/supplier name
            $table->string('receipt_number')->nullable(); // Receipt/invoice number
            $table->date('expense_date'); // When the expense occurred
            $table->string('status', 20)->default('approved'); // pending, approved, rejected
            $table->json('attachments')->nullable(); // File paths for receipts/documents
            $table->text('notes')->nullable(); // Additional notes
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Indexes for better performance
            $table->index(['store_id', 'expense_date']);
            $table->index(['store_id', 'category']);
            $table->index(['store_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};