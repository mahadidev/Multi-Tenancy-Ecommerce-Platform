<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PageType;

class PageTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pageTypes = [
            [
                'type' => 'home',
                'label' => 'Home',
            ],
            [
                'type' => 'about',
                'label' => 'About',
            ],
            [
                'type' => 'contact',
                'label' => 'Contact',
            ],
            [
                'type' => 'products',
                'label' => 'Products',
            ],
        ];

        foreach ($pageTypes as $pageType) {
            PageType::firstOrCreate(
                ['type' => $pageType['type']],
                ['label' => $pageType['label']]
            );
        }
    }
}
