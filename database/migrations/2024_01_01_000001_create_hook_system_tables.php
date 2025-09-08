<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Theme hooks table (if not exists)
        if (!Schema::hasTable('theme_hooks')) {
            Schema::create('theme_hooks', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->enum('type', ['action', 'filter', 'render']);
                $table->string('category')->nullable();
                $table->text('description')->nullable();
                $table->json('parameters')->nullable();
                $table->json('response_schema')->nullable();
                $table->boolean('is_core')->default(false);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                
                $table->index(['type', 'is_active']);
                $table->index('category');
            });
        }

        // Seller hook settings
        Schema::create('seller_hook_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('seller_id');
            $table->foreignId('hook_id')->constrained('theme_hooks')->onDelete('cascade');
            $table->boolean('is_enabled')->default(true);
            $table->string('custom_handler')->nullable();
            $table->json('settings')->nullable();
            $table->integer('priority')->default(10);
            $table->timestamps();
            
            $table->unique(['seller_id', 'hook_id']);
            $table->index('seller_id');
        });

        // Hook executions log
        Schema::create('hook_executions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('seller_id');
            $table->foreignId('hook_id')->constrained('theme_hooks')->onDelete('cascade');
            $table->string('session_id')->nullable();
            $table->json('payload')->nullable();
            $table->json('response')->nullable();
            $table->float('execution_time')->default(0);
            $table->boolean('success')->default(true);
            $table->text('error_message')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            
            $table->index(['seller_id', 'hook_id']);
            $table->index(['seller_id', 'created_at']);
            $table->index('success');
        });
    }

    public function down()
    {
        Schema::dropIfExists('hook_executions');
        Schema::dropIfExists('seller_hook_settings');
        Schema::dropIfExists('theme_hooks');
    }
};