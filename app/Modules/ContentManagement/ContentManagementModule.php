<?php

namespace App\Modules\ContentManagement;

use App\Modules\BaseModule;

class ContentManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'ContentManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Manages blogs, pages, widgets, and content creation';
    }

    public function boot(): void
    {
        // Register content-specific middleware and policies
    }

    public function register(): void
    {
        $this->app->singleton('blog.service', function () {
            return new Services\BlogService();
        });

        $this->app->singleton('page.service', function () {
            return new Services\PageService();
        });

        $this->app->singleton('widget.service', function () {
            return new Services\WidgetService();
        });
    }

    public function getDependencies(): array
    {
        return ['StoreManagement', 'FileManagement'];
    }
}