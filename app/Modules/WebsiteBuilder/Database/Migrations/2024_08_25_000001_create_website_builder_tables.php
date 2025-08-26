<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebsiteBuilderTables extends Migration
{
    public function up()
    {
        // Website Templates table
        Schema::create('website_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('preview_url')->nullable();
            $table->string('category')->nullable();
            $table->json('config')->nullable();
            $table->json('default_pages')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Store Websites table
        Schema::create('store_websites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->foreignId('template_id')->nullable()->constrained('website_templates');
            $table->string('domain')->nullable()->unique();
            $table->string('subdomain')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('favicon')->nullable();
            $table->json('seo_meta')->nullable();
            $table->json('global_styles')->nullable();
            $table->json('analytics_settings')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_maintenance_mode')->default(false);
            $table->text('maintenance_message')->nullable();
            $table->json('meta_data')->nullable();
            $table->timestamps();
            
            $table->index('subdomain');
            $table->index('is_published');
        });

        // Website Pages table
        Schema::create('website_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->json('seo_meta')->nullable();
            $table->json('page_settings')->nullable();
            $table->boolean('is_homepage')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->unique(['website_id', 'slug']);
            $table->index('is_published');
        });

        // Page Sections table
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained('website_pages')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('type'); // header, hero, content, footer, etc.
            $table->json('settings')->nullable();
            $table->json('styles')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
            
            $table->index('sort_order');
        });

        // Component Types table
        Schema::create('component_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->unique(); // text, image, button, form, etc.
            $table->string('category'); // basic, content, media, interactive
            $table->text('description')->nullable();
            $table->json('default_props')->nullable();
            $table->json('prop_schema')->nullable(); // JSON schema for validation
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('category');
        });

        // Section Components table
        Schema::create('section_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('page_sections')->onDelete('cascade');
            $table->foreignId('component_type_id')->constrained('component_types');
            $table->json('props')->nullable();
            $table->json('styles')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();
            
            $table->index('sort_order');
        });

        // Website Assets table
        Schema::create('website_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->string('type'); // image, video, document
            $table->string('filename');
            $table->string('path');
            $table->string('url');
            $table->string('mime_type')->nullable();
            $table->integer('size')->nullable();
            $table->json('meta_data')->nullable();
            $table->timestamps();
            
            $table->index('type');
        });

        // Website Menus table
        Schema::create('website_menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->string('name');
            $table->string('location'); // header, footer, sidebar
            $table->json('items')->nullable(); // Menu structure
            $table->json('styles')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('location');
        });

        // Website Forms table
        Schema::create('website_forms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->string('name');
            $table->string('type'); // contact, newsletter, custom
            $table->json('fields')->nullable();
            $table->json('settings')->nullable();
            $table->string('submit_action')->nullable(); // email, webhook, database
            $table->json('submit_config')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Form Submissions table
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained('website_forms')->onDelete('cascade');
            $table->json('data');
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamps();
            
            $table->index('is_read');
        });

        // Website Page Views table (for analytics)
        Schema::create('website_page_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained('store_websites')->onDelete('cascade');
            $table->foreignId('page_id')->constrained('website_pages')->onDelete('cascade');
            $table->string('path');
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('referrer')->nullable();
            $table->timestamp('viewed_at');
            $table->timestamps();
            
            $table->index(['website_id', 'viewed_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('website_page_views');
        Schema::dropIfExists('form_submissions');
        Schema::dropIfExists('website_forms');
        Schema::dropIfExists('website_menus');
        Schema::dropIfExists('website_assets');
        Schema::dropIfExists('section_components');
        Schema::dropIfExists('component_types');
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('website_pages');
        Schema::dropIfExists('store_websites');
        Schema::dropIfExists('website_templates');
    }
}