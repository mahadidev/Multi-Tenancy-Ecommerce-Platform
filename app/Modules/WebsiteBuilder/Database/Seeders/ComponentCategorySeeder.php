<?php

namespace App\Modules\WebsiteBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\WebsiteBuilder\Models\ComponentCategory;

class ComponentCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Headers',
                'slug' => 'headers',
                'icon' => 'header',
                'description' => 'Header components for website navigation and branding',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Heroes',
                'slug' => 'heroes',
                'icon' => 'hero',
                'description' => 'Hero sections for landing pages and main content areas',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Content',
                'slug' => 'content',
                'icon' => 'content',
                'description' => 'Text content, articles, and informational sections',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'E-commerce',
                'slug' => 'ecommerce',
                'icon' => 'shopping-cart',
                'description' => 'Product displays, carts, and shopping components',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Media',
                'slug' => 'media',
                'icon' => 'image',
                'description' => 'Images, videos, galleries, and media components',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Forms',
                'slug' => 'forms',
                'icon' => 'form',
                'description' => 'Contact forms, newsletters, and user input components',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Navigation',
                'slug' => 'navigation',
                'icon' => 'menu',
                'description' => 'Menus, breadcrumbs, and navigation components',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Footers',
                'slug' => 'footers',
                'icon' => 'footer',
                'description' => 'Footer components with links, contact info, and legal text',
                'sort_order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Testimonials',
                'slug' => 'testimonials',
                'icon' => 'quote',
                'description' => 'Customer reviews, testimonials, and social proof',
                'sort_order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'Features',
                'slug' => 'features',
                'icon' => 'feature',
                'description' => 'Feature lists, benefits, and service descriptions',
                'sort_order' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            ComponentCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}