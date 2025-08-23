<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Website Templates (starter themes)
        Schema::create('website_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('preview_image')->nullable();
            $table->json('preview_images')->nullable(); // Multiple screenshots
            $table->string('category')->default('general'); // e-commerce, blog, portfolio, etc.
            $table->boolean('is_active')->default(true);
            $table->boolean('is_premium')->default(false);
            $table->decimal('price', 8, 2)->default(0);
            $table->integer('sort_order')->default(0);
            $table->json('meta_data')->nullable(); // Template settings, required plugins, etc.
            $table->timestamps();
        });

        // Component Categories (for organizing widgets)
        Schema::create('component_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Component Types (reusable widgets/components)
        Schema::create('component_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('component_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->json('default_props')->nullable(); // Default configuration
            $table->json('schema')->nullable(); // JSON schema for configuration UI
            $table->text('template')->nullable(); // HTML/React template
            $table->json('styles')->nullable(); // Default CSS
            $table->boolean('is_active')->default(true);
            $table->boolean('is_premium')->default(false);
            $table->integer('sort_order')->default(0);
            $table->json('meta_data')->nullable(); // Additional metadata
            $table->timestamps();
        });

        // Store Websites (each store can have a website)
        Schema::create('store_websites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('template_id')->nullable()->constrained('website_templates')->onDelete('set null');
            $table->string('domain')->nullable()->unique(); // Custom domain
            $table->string('subdomain')->unique(); // store-name.yourdomain.com
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('favicon')->nullable();
            $table->json('seo_meta')->nullable(); // SEO settings
            $table->json('global_styles')->nullable(); // Global CSS variables, colors, fonts
            $table->json('analytics_settings')->nullable(); // Google Analytics, etc.
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_maintenance_mode')->default(false);
            $table->string('maintenance_message')->nullable();
            $table->json('meta_data')->nullable();
            $table->timestamps();
        });

        // Website Pages
        Schema::create('website_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('type')->default('custom'); // home, about, contact, product, category, custom
            $table->json('seo_meta')->nullable(); // Page-specific SEO
            $table->boolean('is_published')->default(false);
            $table->boolean('is_homepage')->default(false);
            $table->integer('sort_order')->default(0);
            $table->json('meta_data')->nullable();
            $table->timestamps();
            
            $table->unique(['website_id', 'slug']);
        });

        // Page Sections (containers for components)
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('website_pages')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('type')->default('section'); // section, header, footer, sidebar
            $table->json('container_styles')->nullable(); // Section-level styling
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->json('responsive_settings')->nullable(); // Mobile/tablet visibility
            $table->json('meta_data')->nullable();
            $table->timestamps();
        });

        // Page Components (instances of component types)
        Schema::create('page_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('page_sections')->onDelete('cascade');
            $table->foreignId('component_type_id')->constrained('component_types')->onDelete('cascade');
            $table->string('name')->nullable(); // User-given name for the instance
            $table->json('props')->nullable(); // Component configuration
            $table->json('styles')->nullable(); // Custom styling for this instance
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->json('responsive_settings')->nullable();
            $table->json('animation_settings')->nullable();
            $table->json('meta_data')->nullable();
            $table->timestamps();
        });

        // Template Pages (predefined pages in templates)
        Schema::create('template_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('website_templates')->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->string('type')->default('custom');
            $table->text('description')->nullable();
            $table->boolean('is_homepage')->default(false);
            $table->integer('sort_order')->default(0);
            $table->json('meta_data')->nullable();
            $table->timestamps();
            
            $table->unique(['template_id', 'slug']);
        });

        // Template Sections (predefined sections in template pages)
        Schema::create('template_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_page_id')->constrained('template_pages')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('type')->default('section');
            $table->json('container_styles')->nullable();
            $table->integer('sort_order')->default(0);
            $table->json('meta_data')->nullable();
            $table->timestamps();
        });

        // Template Components (predefined components in template sections)
        Schema::create('template_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_section_id')->constrained('template_sections')->onDelete('cascade');
            $table->foreignId('component_type_id')->constrained('component_types')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->json('props')->nullable();
            $table->json('styles')->nullable();
            $table->integer('sort_order')->default(0);
            $table->json('meta_data')->nullable();
            $table->timestamps();
        });

        // Website Assets (images, files uploaded for the website)
        Schema::create('website_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->string('name');
            $table->string('file_path');
            $table->string('file_type'); // image, video, document, etc.
            $table->string('mime_type');
            $table->bigInteger('file_size');
            $table->json('dimensions')->nullable(); // For images/videos
            $table->string('alt_text')->nullable();
            $table->json('meta_data')->nullable();
            $table->timestamps();
        });

        // Website Navigation Menus
        Schema::create('website_menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->string('name');
            $table->string('location')->default('header'); // header, footer, sidebar
            $table->json('items')->nullable(); // Menu structure as JSON
            $table->json('styles')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Website Forms (contact, newsletter, etc.)
        Schema::create('website_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->string('name');
            $table->string('type')->default('contact'); // contact, newsletter, custom
            $table->json('fields')->nullable(); // Form field definitions
            $table->json('settings')->nullable(); // Email notifications, etc.
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Form Submissions
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained('website_forms')->onDelete('cascade');
            $table->json('data'); // Submitted form data
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // Website Analytics/Tracking
        Schema::create('website_page_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->foreignId('page_id')->nullable()->constrained('website_pages')->onDelete('set null');
            $table->string('path');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referrer')->nullable();
            $table->timestamp('viewed_at');
            $table->integer('session_duration')->nullable(); // in seconds
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_page_views');
        Schema::dropIfExists('form_submissions');
        Schema::dropIfExists('website_forms');
        Schema::dropIfExists('website_menus');
        Schema::dropIfExists('website_assets');
        Schema::dropIfExists('template_components');
        Schema::dropIfExists('template_sections');
        Schema::dropIfExists('template_pages');
        Schema::dropIfExists('page_components');
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('website_pages');
        Schema::dropIfExists('store_websites');
        Schema::dropIfExists('component_types');
        Schema::dropIfExists('component_categories');
        Schema::dropIfExists('website_templates');
    }
};