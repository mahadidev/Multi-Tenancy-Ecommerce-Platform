<?php

namespace App\Modules\WebsiteBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\WebsiteBuilder\Models\WebsiteTemplate;
use Illuminate\Support\Facades\DB;

class ThemeTemplateSeeder extends Seeder
{
    public function run()
    {
        // Clear existing templates safely
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('website_templates')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $templates = [
            [
                'name' => 'Modern E-commerce',
                'slug' => 'modern-ecommerce',
                'description' => 'Clean and modern design perfect for fashion, electronics, and lifestyle stores',
                'category' => 'modern',
                'thumbnail' => '/templates/modern-ecommerce.jpg',
                'preview_url' => '/preview/modern-ecommerce',
                'config' => [
                    'colors' => [
                        'primary' => '#3B82F6',
                        'secondary' => '#10B981',
                        'accent' => '#F59E0B',
                        'dark' => '#1F2937',
                        'light' => '#F9FAFB'
                    ],
                    'fonts' => [
                        'heading' => 'Inter',
                        'body' => 'Inter'
                    ],
                    'layout' => [
                        'containerWidth' => '1280px',
                        'spacing' => 'normal'
                    ]
                ],
                'default_pages' => [
                    [
                        'title' => 'Home',
                        'slug' => 'home',
                        'is_homepage' => true,
                        'sections' => [
                            ['type' => 'navbar_modern', 'order' => 1],
                            ['type' => 'hero_banner_cta', 'order' => 2],
                            ['type' => 'category_showcase', 'order' => 3],
                            ['type' => 'product_grid', 'order' => 4, 'props' => ['title' => 'Featured Products', 'filter' => 'featured']],
                            ['type' => 'feature_cards', 'order' => 5],
                            ['type' => 'product_tabs', 'order' => 6],
                            ['type' => 'testimonials', 'order' => 7],
                            ['type' => 'footer_modern', 'order' => 8]
                        ]
                    ],
                    [
                        'title' => 'Products',
                        'slug' => 'products',
                        'sections' => [
                            ['type' => 'navbar_modern', 'order' => 1],
                            ['type' => 'product_search', 'order' => 2],
                            ['type' => 'product_grid', 'order' => 3, 'props' => ['filter' => 'all', 'rows' => 4]],
                            ['type' => 'footer_modern', 'order' => 4]
                        ]
                    ],
                    [
                        'title' => 'About',
                        'slug' => 'about',
                        'sections' => [
                            ['type' => 'navbar_modern', 'order' => 1],
                            ['type' => 'hero_split', 'order' => 2],
                            ['type' => 'rich_text', 'order' => 3],
                            ['type' => 'feature_cards', 'order' => 4],
                            ['type' => 'testimonials', 'order' => 5],
                            ['type' => 'footer_modern', 'order' => 6]
                        ]
                    ],
                    [
                        'title' => 'Contact',
                        'slug' => 'contact',
                        'sections' => [
                            ['type' => 'navbar_modern', 'order' => 1],
                            ['type' => 'contact_form', 'order' => 2],
                            ['type' => 'footer_modern', 'order' => 3]
                        ]
                    ]
                ],
                'is_active' => true
            ],
            [
                'name' => 'Minimalist Store',
                'slug' => 'minimalist-store',
                'description' => 'Simple and elegant design focusing on products with minimal distractions',
                'category' => 'minimal',
                'thumbnail' => '/templates/minimalist-store.jpg',
                'preview_url' => '/preview/minimalist-store',
                'config' => [
                    'colors' => [
                        'primary' => '#000000',
                        'secondary' => '#666666',
                        'accent' => '#E11D48',
                        'dark' => '#000000',
                        'light' => '#FFFFFF'
                    ],
                    'fonts' => [
                        'heading' => 'Helvetica Neue',
                        'body' => 'Helvetica Neue'
                    ],
                    'layout' => [
                        'containerWidth' => '1440px',
                        'spacing' => 'large'
                    ]
                ],
                'default_pages' => [
                    [
                        'title' => 'Home',
                        'slug' => 'home',
                        'is_homepage' => true,
                        'sections' => [
                            ['type' => 'navbar_minimal', 'order' => 1],
                            ['type' => 'hero_minimal', 'order' => 2],
                            ['type' => 'product_grid', 'order' => 3, 'props' => ['cardStyle' => 'minimal']],
                            ['type' => 'footer_minimal', 'order' => 4]
                        ]
                    ]
                ],
                'is_active' => true
            ],
            [
                'name' => 'Bold & Colorful',
                'slug' => 'bold-colorful',
                'description' => 'Vibrant and energetic design perfect for youth-oriented brands',
                'category' => 'creative',
                'thumbnail' => '/templates/bold-colorful.jpg',
                'preview_url' => '/preview/bold-colorful',
                'config' => [
                    'colors' => [
                        'primary' => '#8B5CF6',
                        'secondary' => '#EC4899',
                        'accent' => '#FBBF24',
                        'dark' => '#111827',
                        'light' => '#FEF3C7'
                    ],
                    'fonts' => [
                        'heading' => 'Poppins',
                        'body' => 'Open Sans'
                    ],
                    'layout' => [
                        'containerWidth' => '1200px',
                        'spacing' => 'normal'
                    ]
                ],
                'default_pages' => [
                    [
                        'title' => 'Home',
                        'slug' => 'home',
                        'is_homepage' => true,
                        'sections' => [
                            ['type' => 'navbar_modern', 'order' => 1],
                            ['type' => 'hero_slider', 'order' => 2],
                            ['type' => 'category_showcase', 'order' => 3, 'props' => ['layout' => 'masonry']],
                            ['type' => 'product_carousel', 'order' => 4],
                            ['type' => 'discount_banner', 'order' => 5],
                            ['type' => 'product_grid', 'order' => 6],
                            ['type' => 'footer_modern', 'order' => 7]
                        ]
                    ]
                ],
                'is_active' => true
            ],
            [
                'name' => 'Luxury Premium',
                'slug' => 'luxury-premium',
                'description' => 'Sophisticated design for high-end products and luxury brands',
                'category' => 'luxury',
                'thumbnail' => '/templates/luxury-premium.jpg',
                'preview_url' => '/preview/luxury-premium',
                'config' => [
                    'colors' => [
                        'primary' => '#D4AF37',
                        'secondary' => '#1A1A1A',
                        'accent' => '#8B7355',
                        'dark' => '#0A0A0A',
                        'light' => '#FAF9F6'
                    ],
                    'fonts' => [
                        'heading' => 'Playfair Display',
                        'body' => 'Lato'
                    ],
                    'layout' => [
                        'containerWidth' => '1400px',
                        'spacing' => 'large'
                    ]
                ],
                'default_pages' => [
                    [
                        'title' => 'Home',
                        'slug' => 'home',
                        'is_homepage' => true,
                        'sections' => [
                            ['type' => 'navbar_luxury', 'order' => 1],
                            ['type' => 'hero_fullscreen', 'order' => 2],
                            ['type' => 'product_showcase_luxury', 'order' => 3],
                            ['type' => 'brand_story', 'order' => 4],
                            ['type' => 'product_grid', 'order' => 5, 'props' => ['cardStyle' => 'luxury']],
                            ['type' => 'footer_luxury', 'order' => 6]
                        ]
                    ]
                ],
                'is_active' => true,
                'is_premium' => true
            ],
            [
                'name' => 'Tech & Gadgets',
                'slug' => 'tech-gadgets',
                'description' => 'Modern tech-focused design for electronics and gadget stores',
                'category' => 'tech',
                'thumbnail' => '/templates/tech-gadgets.jpg',
                'preview_url' => '/preview/tech-gadgets',
                'config' => [
                    'colors' => [
                        'primary' => '#0EA5E9',
                        'secondary' => '#6366F1',
                        'accent' => '#10B981',
                        'dark' => '#0F172A',
                        'light' => '#F8FAFC'
                    ],
                    'fonts' => [
                        'heading' => 'Roboto',
                        'body' => 'Roboto'
                    ],
                    'layout' => [
                        'containerWidth' => '1280px',
                        'spacing' => 'normal'
                    ]
                ],
                'default_pages' => [
                    [
                        'title' => 'Home',
                        'slug' => 'home',
                        'is_homepage' => true,
                        'sections' => [
                            ['type' => 'navbar_megamenu', 'order' => 1],
                            ['type' => 'hero_slider', 'order' => 2],
                            ['type' => 'product_tabs', 'order' => 3],
                            ['type' => 'feature_cards', 'order' => 4, 'props' => ['style' => 'tech']],
                            ['type' => 'product_grid', 'order' => 5, 'props' => ['filter' => 'new']],
                            ['type' => 'brand_logos', 'order' => 6],
                            ['type' => 'footer_modern', 'order' => 7]
                        ]
                    ]
                ],
                'is_active' => true
            ],
            [
                'name' => 'Food & Restaurant',
                'slug' => 'food-restaurant',
                'description' => 'Appetizing design for food delivery and restaurant websites',
                'category' => 'food',
                'thumbnail' => '/templates/food-restaurant.jpg',
                'preview_url' => '/preview/food-restaurant',
                'config' => [
                    'colors' => [
                        'primary' => '#DC2626',
                        'secondary' => '#EA580C',
                        'accent' => '#16A34A',
                        'dark' => '#7C2D12',
                        'light' => '#FFF7ED'
                    ],
                    'fonts' => [
                        'heading' => 'Merriweather',
                        'body' => 'Source Sans Pro'
                    ],
                    'layout' => [
                        'containerWidth' => '1200px',
                        'spacing' => 'normal'
                    ]
                ],
                'default_pages' => [
                    [
                        'title' => 'Home',
                        'slug' => 'home',
                        'is_homepage' => true,
                        'sections' => [
                            ['type' => 'navbar_modern', 'order' => 1],
                            ['type' => 'hero_food', 'order' => 2],
                            ['type' => 'menu_categories', 'order' => 3],
                            ['type' => 'product_grid', 'order' => 4, 'props' => ['title' => 'Popular Items']],
                            ['type' => 'delivery_info', 'order' => 5],
                            ['type' => 'testimonials', 'order' => 6],
                            ['type' => 'footer_modern', 'order' => 7]
                        ]
                    ]
                ],
                'is_active' => true
            ]
        ];

        foreach ($templates as $template) {
            WebsiteTemplate::create($template);
        }
    }
}