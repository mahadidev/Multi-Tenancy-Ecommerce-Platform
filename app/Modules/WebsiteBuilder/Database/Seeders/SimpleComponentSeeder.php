<?php

namespace App\Modules\WebsiteBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\WebsiteBuilder\Models\ComponentType;
use App\Modules\WebsiteBuilder\Models\WebsiteTemplate;
use Illuminate\Support\Facades\DB;

class SimpleComponentSeeder extends Seeder
{
    public function run()
    {
        // Create basic components if table exists
        if (!\Schema::hasTable('component_types')) {
            $this->command->info('Component types table does not exist. Skipping component seeding.');
            return;
        }

        // Get the table structure
        $columns = \Schema::getColumnListing('component_types');
        $this->command->info('Component types table columns: ' . implode(', ', $columns));

        // Create some basic components based on available columns
        $components = [
            [
                'name' => 'Hero Banner',
                'slug' => 'hero-banner',
                'description' => 'Full-width hero section with background image and text',
                'icon' => 'hero',
                'default_props' => [
                    'title' => 'Welcome to Our Store',
                    'subtitle' => 'Discover amazing products',
                    'backgroundImage' => '/placeholder.jpg'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Product Grid',
                'slug' => 'product-grid',
                'description' => 'Display products in a grid layout',
                'icon' => 'grid',
                'default_props' => [
                    'title' => 'Featured Products',
                    'columns' => 4,
                    'rows' => 2
                ],
                'is_active' => true
            ],
            [
                'name' => 'Text Block',
                'slug' => 'text-block',
                'description' => 'Rich text content block',
                'icon' => 'text',
                'default_props' => [
                    'content' => '<p>Your content here...</p>',
                    'alignment' => 'left'
                ],
                'is_active' => true
            ]
        ];

        foreach ($components as $componentData) {
            // Only include fields that exist in the table
            $data = [];
            foreach ($componentData as $key => $value) {
                if (in_array($key, $columns)) {
                    $data[$key] = $value;
                }
            }

            ComponentType::updateOrCreate(
                ['slug' => $componentData['slug']], 
                $data
            );
        }

        $this->command->info('Basic components seeded successfully!');
    }
}