<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateThemeSystemWithStores extends Migration
{
    public function up()
    {
        // Skip if themes table already has our columns
        if (!Schema::hasTable('themes') || Schema::hasColumn('themes', 'config_schema')) {
            // Extended themes table - only add new columns if table exists
            if (Schema::hasTable('themes') && !Schema::hasColumn('themes', 'config_schema')) {
                Schema::table('themes', function (Blueprint $table) {
                    $table->json('config_schema')->nullable()->after('features');
                    $table->json('hooks_manifest')->nullable()->after('config_schema');
                    $table->json('components')->nullable()->after('hooks_manifest');
                    $table->json('layouts')->nullable()->after('components');
                    $table->json('presets')->nullable()->after('layouts');
                    $table->boolean('is_featured')->default(false)->after('is_active');
                    $table->integer('installations_count')->default(0)->after('is_featured');
                });
            }
        }

        // Store theme installations (using stores instead of sellers)
        if (!Schema::hasTable('store_themes')) {
            Schema::create('store_themes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
                $table->foreignId('theme_id')->constrained('themes')->onDelete('cascade');
                $table->boolean('is_active')->default(false);
                $table->timestamp('activated_at')->nullable();
                $table->timestamp('deactivated_at')->nullable();
                $table->json('license_data')->nullable();
                $table->timestamps();
                
                $table->unique(['store_id', 'theme_id']);
                $table->index(['store_id', 'is_active']);
            });
        }

        // Theme customizations per store
        if (!Schema::hasTable('theme_customizations')) {
            Schema::create('theme_customizations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
                $table->foreignId('theme_id')->constrained('themes')->onDelete('cascade');
                $table->string('name')->default('Default');
                $table->json('colors')->nullable();
                $table->json('fonts')->nullable();
                $table->json('spacing')->nullable();
                $table->json('settings')->nullable();
                $table->text('custom_css')->nullable();
                $table->json('tailwind_config')->nullable();
                $table->boolean('is_active')->default(false);
                $table->timestamps();
                
                $table->index(['store_id', 'theme_id', 'is_active']);
            });
        }

        // Component-level style customizations
        if (!Schema::hasTable('component_styles')) {
            Schema::create('component_styles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('customization_id')->constrained('theme_customizations')->onDelete('cascade');
                $table->string('component_path');
                $table->string('element_identifier')->nullable();
                $table->text('tailwind_classes')->nullable();
                $table->text('custom_css')->nullable();
                $table->json('responsive_classes')->nullable();
                $table->integer('priority')->default(0);
                $table->timestamps();
                
                $table->index(['customization_id', 'component_path']);
            });
        }

        // Theme hooks registry
        if (!Schema::hasTable('theme_hooks')) {
            Schema::create('theme_hooks', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->string('type');
                $table->string('category');
                $table->text('description')->nullable();
                $table->json('parameters')->nullable();
                $table->json('response_schema')->nullable();
                $table->boolean('is_core')->default(true);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                
                $table->index(['type', 'is_active']);
            });
        }

        // Store hook configurations
        if (!Schema::hasTable('store_hook_settings')) {
            Schema::create('store_hook_settings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
                $table->foreignId('hook_id')->constrained('theme_hooks')->onDelete('cascade');
                $table->boolean('is_enabled')->default(true);
                $table->string('custom_handler')->nullable();
                $table->json('settings')->nullable();
                $table->integer('priority')->default(10);
                $table->timestamps();
                
                $table->unique(['store_id', 'hook_id']);
                $table->index(['store_id', 'is_enabled']);
            });
        }

        // Hook execution logs
        if (!Schema::hasTable('hook_executions')) {
            Schema::create('hook_executions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
                $table->foreignId('hook_id')->constrained('theme_hooks')->onDelete('cascade');
                $table->string('session_id')->nullable();
                $table->json('payload')->nullable();
                $table->json('response')->nullable();
                $table->integer('execution_time')->nullable();
                $table->boolean('success')->default(true);
                $table->text('error_message')->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->string('user_agent')->nullable();
                $table->timestamp('created_at')->useCurrent();
                
                $table->index(['store_id', 'hook_id', 'created_at']);
                $table->index(['store_id', 'success', 'created_at']);
            });
        }

        // Theme assets
        if (!Schema::hasTable('theme_assets')) {
            Schema::create('theme_assets', function (Blueprint $table) {
                $table->id();
                $table->foreignId('theme_id')->constrained('themes')->onDelete('cascade');
                $table->foreignId('store_id')->nullable()->constrained('stores')->onDelete('cascade');
                $table->string('type');
                $table->string('path');
                $table->string('url');
                $table->string('mime_type')->nullable();
                $table->integer('size')->nullable();
                $table->json('metadata')->nullable();
                $table->timestamps();
                
                $table->index(['theme_id', 'type']);
                $table->index(['store_id', 'type']);
            });
        }

        // Theme version history
        if (!Schema::hasTable('theme_versions')) {
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
        }

        // Add theme support to store_websites
        if (Schema::hasTable('store_websites')) {
            if (!Schema::hasColumn('store_websites', 'theme_id')) {
                Schema::table('store_websites', function (Blueprint $table) {
                    $table->foreignId('theme_id')->nullable()->after('template_id')->constrained('themes');
                    $table->foreignId('theme_customization_id')->nullable()->after('theme_id')->constrained('theme_customizations');
                });
            }
        }

        // Add component overrides to website_pages
        if (Schema::hasTable('website_pages')) {
            if (!Schema::hasColumn('website_pages', 'component_overrides')) {
                Schema::table('website_pages', function (Blueprint $table) {
                    $table->json('component_overrides')->nullable();
                    $table->json('hook_settings')->nullable();
                });
            }
        }
    }

    public function down()
    {
        // Remove added columns from existing tables
        if (Schema::hasTable('website_pages')) {
            if (Schema::hasColumn('website_pages', 'component_overrides')) {
                Schema::table('website_pages', function (Blueprint $table) {
                    $table->dropColumn(['component_overrides', 'hook_settings']);
                });
            }
        }

        if (Schema::hasTable('store_websites')) {
            if (Schema::hasColumn('store_websites', 'theme_id')) {
                Schema::table('store_websites', function (Blueprint $table) {
                    $table->dropForeign(['theme_id']);
                    $table->dropForeign(['theme_customization_id']);
                    $table->dropColumn(['theme_id', 'theme_customization_id']);
                });
            }
        }

        // Drop new tables
        Schema::dropIfExists('theme_versions');
        Schema::dropIfExists('theme_assets');
        Schema::dropIfExists('hook_executions');
        Schema::dropIfExists('store_hook_settings');
        Schema::dropIfExists('theme_hooks');
        Schema::dropIfExists('component_styles');
        Schema::dropIfExists('theme_customizations');
        Schema::dropIfExists('store_themes');
    }
}