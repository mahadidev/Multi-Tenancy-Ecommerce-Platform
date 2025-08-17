<?php

namespace App\Modules\ThemeManagement;

use App\Modules\BaseModule;

class ThemeManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'ThemeManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Handles theme management, theme pages, and theme customization functionality';
    }

    public function getDependencies(): array
    {
        return [
            'ContentManagement', // For widgets and content
            'StoreManagement',   // For store theme associations
        ];
    }

    public function boot(): void
    {
        // Load module-specific configurations, views, etc.
        parent::boot();
    }

    public function register(): void
    {
        // Register module-specific services
        parent::register();
    }
}