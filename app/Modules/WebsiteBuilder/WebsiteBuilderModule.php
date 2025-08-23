<?php

namespace App\Modules\WebsiteBuilder;

use App\Modules\BaseModule;

class WebsiteBuilderModule extends BaseModule
{
    public function getName(): string
    {
        return 'WebsiteBuilder';
    }

    public function getDescription(): string
    {
        return 'Multi-tenant website builder with drag-and-drop page editor';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getRoutes(): array
    {
        return [
            __DIR__ . '/Routes/api.php',
        ];
    }

    public function getMigrations(): array
    {
        return [
            __DIR__ . '/Database/Migrations',
        ];
    }

    public function getSeeders(): array
    {
        return [
            \App\Modules\WebsiteBuilder\Database\Seeders\ComponentCategorySeeder::class,
            \App\Modules\WebsiteBuilder\Database\Seeders\ComponentTypeSeeder::class,
            \App\Modules\WebsiteBuilder\Database\Seeders\WebsiteTemplateSeeder::class,
        ];
    }
}