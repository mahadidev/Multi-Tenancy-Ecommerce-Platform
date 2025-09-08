<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThemeSystemTables extends Migration
{
    public function up()
    {
        // Core themes registry - shared across all sellers
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('version', 20);
            $table->string('author')->nullable();
            $table->string('author_url')->nullable();
            $table->text('description')->nullable();
            $table->string('preview_url')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('category')->default('general'); // general, ecommerce, blog, portfolio
            $table->decimal('price', 10, 2)->default(0); // 0 = free
            $table->json('features')->nullable(); // ['responsive', 'dark_mode', 'multi_language']
            $table->json('config_schema')->nullable(); // Defines customizable options
            $table->json('hooks_manifest')->nullable(); // Required and optional hooks
            $table->json('components')->nullable(); // Available components in theme
            $table->json('layouts')->nullable(); // Available layouts
            $table->json('presets')->nullable(); // Pre-built page templates
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('installations_count')->default(0);
            $table->timestamps();
            
            $table->index(['slug', 'is_active']);
            $table->index('category');
        });

        // Seller theme installations
        Schema::create('seller_themes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
            $table->foreignId('theme_id')->constrained('themes')->onDelete('cascade');
            $table->boolean('is_active')->default(false);
            $table->timestamp('activated_at')->nullable();
            $table->timestamp('deactivated_at')->nullable();
            $table->json('license_data')->nullable(); // For premium themes
            $table->timestamps();
            
            $table->unique(['seller_id', 'theme_id']);
            $table->index(['seller_id', 'is_active']);
        });

        // Theme customizations per seller
        Schema::create('theme_customizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
            $table->foreignId('theme_id')->constrained('themes')->onDelete('cascade');
            $table->string('name')->default('Default'); // Customization preset name
            $table->json('colors')->nullable(); // Color scheme overrides
            $table->json('fonts')->nullable(); // Typography settings
            $table->json('spacing')->nullable(); // Padding, margins, gaps
            $table->json('settings')->nullable(); // General theme settings
            $table->text('custom_css')->nullable(); // Additional CSS
            $table->json('tailwind_config')->nullable(); // Tailwind class mappings
            $table->boolean('is_active')->default(false);
            $table->timestamps();
            
            $table->index(['seller_id', 'theme_id', 'is_active']);
        });

        // Component-level style customizations
        Schema::create('component_styles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customization_id')->constrained('theme_customizations')->onDelete('cascade');
            $table->string('component_path'); // e.g., 'sections.hero.title'
            $table->string('element_identifier')->nullable(); // Specific element ID
            $table->text('tailwind_classes')->nullable(); // Tailwind classes
            $table->text('custom_css')->nullable(); // Custom CSS rules
            $table->json('responsive_classes')->nullable(); // Classes per breakpoint
            $table->integer('priority')->default(0); // Override priority
            $table->timestamps();
            
            $table->index(['customization_id', 'component_path']);
        });

        // Theme hooks registry
        Schema::create('theme_hooks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'action:add-to-cart'
            $table->string('type'); // action, filter, render
            $table->string('category'); // commerce, auth, content
            $table->text('description')->nullable();
            $table->json('parameters')->nullable(); // Expected parameters
            $table->json('response_schema')->nullable(); // Expected response
            $table->boolean('is_core')->default(true); // Platform-provided vs custom
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['type', 'is_active']);
        });

        // Seller hook configurations
        Schema::create('seller_hook_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
            $table->foreignId('hook_id')->constrained('theme_hooks')->onDelete('cascade');
            $table->boolean('is_enabled')->default(true);
            $table->string('custom_handler')->nullable(); // Webhook URL for custom logic
            $table->json('settings')->nullable(); // Hook-specific settings
            $table->integer('priority')->default(10); // Execution priority
            $table->timestamps();
            
            $table->unique(['seller_id', 'hook_id']);
            $table->index(['seller_id', 'is_enabled']);
        });

        // Hook execution logs for debugging
        Schema::create('hook_executions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
            $table->foreignId('hook_id')->constrained('theme_hooks')->onDelete('cascade');
            $table->string('session_id')->nullable();
            $table->json('payload')->nullable();
            $table->json('response')->nullable();
            $table->integer('execution_time')->nullable(); // in milliseconds
            $table->boolean('success')->default(true);
            $table->text('error_message')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index(['seller_id', 'hook_id', 'created_at']);
            $table->index(['seller_id', 'success', 'created_at']);
        });

        // Theme assets (for custom uploads)
        Schema::create('theme_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('theme_id')->constrained('themes')->onDelete('cascade');
            $table->foreignId('seller_id')->nullable()->constrained('sellers')->onDelete('cascade');
            $table->string('type'); // css, js, image, font
            $table->string('path');
            $table->string('url');
            $table->string('mime_type')->nullable();
            $table->integer('size')->nullable(); // in bytes
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['theme_id', 'type']);
            $table->index(['seller_id', 'type']);
        });

        // Theme version history
        Schema::create('theme_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('theme_id')->constrained('themes')->onDelete('cascade');
            $table->string('version', 20);
            $table->text('changelog')->nullable();
            $table->json('breaking_changes')->nullable();
            $table->boolean('is_stable')->default(true);
            $table->timestamp('released_at');
            $table->timestamps();
            
            $table->index(['theme_id', 'version']);
        });

        // Add theme support to existing tables
        Schema::table('store_websites', function (Blueprint $table) {
            $table->foreignId('theme_id')->nullable()->after('template_id')->constrained('themes');
            $table->foreignId('theme_customization_id')->nullable()->after('theme_id')->constrained('theme_customizations');
        });

        Schema::table('website_pages', function (Blueprint $table) {
            $table->json('component_overrides')->nullable()->after('components');
            $table->json('hook_settings')->nullable()->after('component_overrides');
        });
    }

    public function down()
    {
        Schema::table('website_pages', function (Blueprint $table) {
            $table->dropColumn(['component_overrides', 'hook_settings']);
        });

        Schema::table('store_websites', function (Blueprint $table) {
            $table->dropForeign(['theme_id']);
            $table->dropForeign(['theme_customization_id']);
            $table->dropColumn(['theme_id', 'theme_customization_id']);
        });

        Schema::dropIfExists('theme_versions');
        Schema::dropIfExists('theme_assets');
        Schema::dropIfExists('hook_executions');
        Schema::dropIfExists('seller_hook_settings');
        Schema::dropIfExists('theme_hooks');
        Schema::dropIfExists('component_styles');
        Schema::dropIfExists('theme_customizations');
        Schema::dropIfExists('seller_themes');
        Schema::dropIfExists('themes');
    }
}