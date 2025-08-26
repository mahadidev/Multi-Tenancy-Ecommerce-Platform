<?php

namespace App\Modules\WebsiteBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\WebsiteBuilder\Models\ComponentType;
use Illuminate\Support\Facades\DB;

class ComponentLibrarySeeder extends Seeder
{
    public function run()
    {
        // Clear existing component types safely
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('component_types')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Hero Components
        $this->createHeroComponents();
        
        // Header Components
        $this->createHeaderComponents();
        
        // Product Components
        $this->createProductComponents();
        
        // Content Components
        $this->createContentComponents();
        
        // Footer Components
        $this->createFooterComponents();
        
        // E-commerce Components
        $this->createEcommerceComponents();
    }

    private function createHeroComponents()
    {
        $heroes = [
            [
                'name' => 'Hero Banner with CTA',
                'type' => 'hero_banner_cta',
                'category' => 'hero',
                'description' => 'Full-width hero section with background image, headline, and call-to-action buttons',
                'default_props' => [
                    'title' => 'Welcome to Our Store',
                    'subtitle' => 'Discover amazing products at unbeatable prices',
                    'backgroundImage' => '/api/placeholder/1920/600',
                    'primaryButtonText' => 'Shop Now',
                    'primaryButtonLink' => '/products',
                    'secondaryButtonText' => 'Learn More',
                    'secondaryButtonLink' => '/about',
                    'overlay' => true,
                    'overlayOpacity' => 0.5,
                    'textAlign' => 'center',
                    'height' => 'large'
                ],
                'prop_schema' => [
                    'type' => 'object',
                    'properties' => [
                        'title' => ['type' => 'string', 'title' => 'Title'],
                        'subtitle' => ['type' => 'string', 'title' => 'Subtitle'],
                        'backgroundImage' => ['type' => 'string', 'format' => 'image', 'title' => 'Background Image'],
                        'primaryButtonText' => ['type' => 'string', 'title' => 'Primary Button Text'],
                        'primaryButtonLink' => ['type' => 'string', 'title' => 'Primary Button Link'],
                        'secondaryButtonText' => ['type' => 'string', 'title' => 'Secondary Button Text'],
                        'secondaryButtonLink' => ['type' => 'string', 'title' => 'Secondary Button Link'],
                        'overlay' => ['type' => 'boolean', 'title' => 'Show Overlay'],
                        'overlayOpacity' => ['type' => 'number', 'minimum' => 0, 'maximum' => 1, 'title' => 'Overlay Opacity'],
                        'textAlign' => ['type' => 'string', 'enum' => ['left', 'center', 'right'], 'title' => 'Text Alignment'],
                        'height' => ['type' => 'string', 'enum' => ['small', 'medium', 'large', 'full'], 'title' => 'Section Height']
                    ]
                ]
            ],
            [
                'name' => 'Hero Slider',
                'type' => 'hero_slider',
                'category' => 'hero',
                'description' => 'Carousel slider with multiple slides for featured content',
                'default_props' => [
                    'slides' => [
                        [
                            'title' => 'Summer Collection',
                            'subtitle' => 'Up to 50% off on selected items',
                            'image' => '/api/placeholder/1920/600',
                            'buttonText' => 'Shop Now',
                            'buttonLink' => '/summer-sale'
                        ],
                        [
                            'title' => 'New Arrivals',
                            'subtitle' => 'Check out our latest products',
                            'image' => '/api/placeholder/1920/600',
                            'buttonText' => 'Explore',
                            'buttonLink' => '/new-arrivals'
                        ]
                    ],
                    'autoplay' => true,
                    'interval' => 5000,
                    'showIndicators' => true,
                    'showArrows' => true
                ]
            ],
            [
                'name' => 'Split Hero',
                'type' => 'hero_split',
                'category' => 'hero',
                'description' => 'Hero section with content on one side and image on the other',
                'default_props' => [
                    'title' => 'Premium Quality Products',
                    'description' => 'We source the best materials and craft products that last.',
                    'image' => '/api/placeholder/800/600',
                    'imagePosition' => 'right',
                    'primaryButtonText' => 'View Collection',
                    'primaryButtonLink' => '/collections',
                    'features' => [
                        'Free Shipping on Orders Over $50',
                        '30-Day Money Back Guarantee',
                        '24/7 Customer Support'
                    ]
                ]
            ]
        ];

        foreach ($heroes as $hero) {
            ComponentType::create([
                'name' => $hero['name'],
                'type' => $hero['type'],
                'category' => $hero['category'],
                'description' => $hero['description'],
                'default_props' => $hero['default_props'],
                'prop_schema' => $hero['prop_schema'] ?? null,
                'icon' => 'hero-icon',
                'is_active' => true
            ]);
        }
    }

    private function createHeaderComponents()
    {
        $headers = [
            [
                'name' => 'Modern Navigation Bar',
                'type' => 'navbar_modern',
                'category' => 'header',
                'description' => 'Responsive navigation with logo, menu items, search, and cart',
                'default_props' => [
                    'logo' => ['type' => 'text', 'value' => 'Your Store'],
                    'menuItems' => [
                        ['label' => 'Home', 'link' => '/'],
                        ['label' => 'Products', 'link' => '/products'],
                        ['label' => 'About', 'link' => '/about'],
                        ['label' => 'Contact', 'link' => '/contact']
                    ],
                    'showSearch' => true,
                    'showCart' => true,
                    'showAccount' => true,
                    'sticky' => true,
                    'transparent' => false,
                    'style' => 'modern'
                ]
            ],
            [
                'name' => 'Mega Menu Header',
                'type' => 'navbar_megamenu',
                'category' => 'header',
                'description' => 'Navigation with dropdown mega menu for categories',
                'default_props' => [
                    'categories' => 'dynamic', // Will fetch from store
                    'showPromoBar' => true,
                    'promoText' => 'Free shipping on orders over $50!',
                    'showCurrency' => true,
                    'showLanguage' => false
                ]
            ]
        ];

        foreach ($headers as $header) {
            ComponentType::create([
                'name' => $header['name'],
                'type' => $header['type'],
                'category' => $header['category'],
                'description' => $header['description'],
                'default_props' => $header['default_props'],
                'icon' => 'header-icon',
                'is_active' => true
            ]);
        }
    }

    private function createProductComponents()
    {
        $products = [
            [
                'name' => 'Product Grid',
                'type' => 'product_grid',
                'category' => 'products',
                'description' => 'Responsive grid layout for displaying products',
                'default_props' => [
                    'title' => 'Featured Products',
                    'subtitle' => 'Check out our best sellers',
                    'columns' => 4,
                    'rows' => 2,
                    'filter' => 'featured', // featured, new, sale, category
                    'categoryId' => null,
                    'showPrice' => true,
                    'showRating' => true,
                    'showQuickView' => true,
                    'showAddToCart' => true,
                    'cardStyle' => 'modern' // modern, classic, minimal
                ]
            ],
            [
                'name' => 'Product Carousel',
                'type' => 'product_carousel',
                'category' => 'products',
                'description' => 'Horizontal scrolling carousel for products',
                'default_props' => [
                    'title' => 'You May Also Like',
                    'itemsToShow' => 4,
                    'itemsToScroll' => 1,
                    'autoplay' => false,
                    'filter' => 'related',
                    'showArrows' => true,
                    'showDots' => false
                ]
            ],
            [
                'name' => 'Category Showcase',
                'type' => 'category_showcase',
                'category' => 'products',
                'description' => 'Display product categories in an attractive layout',
                'default_props' => [
                    'title' => 'Shop by Category',
                    'layout' => 'grid', // grid, masonry, carousel
                    'showProductCount' => true,
                    'columns' => 3,
                    'imageRatio' => 'square' // square, portrait, landscape
                ]
            ],
            [
                'name' => 'Product Tabs',
                'type' => 'product_tabs',
                'category' => 'products',
                'description' => 'Tabbed interface to show different product collections',
                'default_props' => [
                    'tabs' => [
                        ['label' => 'New Arrivals', 'filter' => 'new'],
                        ['label' => 'Best Sellers', 'filter' => 'featured'],
                        ['label' => 'On Sale', 'filter' => 'sale']
                    ],
                    'productsPerTab' => 8,
                    'columns' => 4
                ]
            ]
        ];

        foreach ($products as $product) {
            ComponentType::create([
                'name' => $product['name'],
                'type' => $product['type'],
                'category' => $product['category'],
                'description' => $product['description'],
                'default_props' => $product['default_props'],
                'icon' => 'product-icon',
                'is_active' => true
            ]);
        }
    }

    private function createContentComponents()
    {
        $contents = [
            [
                'name' => 'Rich Text Editor',
                'type' => 'rich_text',
                'category' => 'content',
                'description' => 'WYSIWYG text editor for custom content',
                'default_props' => [
                    'content' => '<h2>Your Content Here</h2><p>Start typing to add your content...</p>',
                    'alignment' => 'left',
                    'maxWidth' => 'container'
                ]
            ],
            [
                'name' => 'Image Gallery',
                'type' => 'image_gallery',
                'category' => 'content',
                'description' => 'Responsive image gallery with lightbox',
                'default_props' => [
                    'images' => [
                        ['src' => '/api/placeholder/400/300', 'alt' => 'Gallery Image 1'],
                        ['src' => '/api/placeholder/400/300', 'alt' => 'Gallery Image 2'],
                        ['src' => '/api/placeholder/400/300', 'alt' => 'Gallery Image 3']
                    ],
                    'columns' => 3,
                    'gap' => 'medium',
                    'enableLightbox' => true,
                    'style' => 'grid' // grid, masonry, carousel
                ]
            ],
            [
                'name' => 'Video Embed',
                'type' => 'video_embed',
                'category' => 'content',
                'description' => 'Embed YouTube, Vimeo, or custom videos',
                'default_props' => [
                    'videoUrl' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'aspectRatio' => '16:9',
                    'autoplay' => false,
                    'controls' => true,
                    'title' => 'Watch Our Story'
                ]
            ],
            [
                'name' => 'Testimonials',
                'type' => 'testimonials',
                'category' => 'content',
                'description' => 'Customer testimonials carousel or grid',
                'default_props' => [
                    'title' => 'What Our Customers Say',
                    'testimonials' => [
                        [
                            'content' => 'Amazing products and excellent service!',
                            'author' => 'John Doe',
                            'role' => 'Verified Buyer',
                            'rating' => 5,
                            'avatar' => '/api/placeholder/60/60'
                        ]
                    ],
                    'layout' => 'carousel', // carousel, grid
                    'showRating' => true
                ]
            ],
            [
                'name' => 'Feature Cards',
                'type' => 'feature_cards',
                'category' => 'content',
                'description' => 'Highlight features or services with icon cards',
                'default_props' => [
                    'features' => [
                        [
                            'icon' => 'truck',
                            'title' => 'Free Shipping',
                            'description' => 'On orders over $50'
                        ],
                        [
                            'icon' => 'shield',
                            'title' => 'Secure Payment',
                            'description' => '100% secure transactions'
                        ],
                        [
                            'icon' => 'refresh',
                            'title' => 'Easy Returns',
                            'description' => '30-day return policy'
                        ]
                    ],
                    'columns' => 3,
                    'style' => 'bordered' // bordered, shadow, minimal
                ]
            ],
            [
                'name' => 'FAQ Accordion',
                'type' => 'faq_accordion',
                'category' => 'content',
                'description' => 'Frequently asked questions in accordion format',
                'default_props' => [
                    'title' => 'Frequently Asked Questions',
                    'faqs' => [
                        [
                            'question' => 'What is your return policy?',
                            'answer' => 'We offer a 30-day return policy for all products.'
                        ]
                    ],
                    'allowMultiple' => false,
                    'icon' => 'plus' // plus, arrow, chevron
                ]
            ]
        ];

        foreach ($contents as $content) {
            ComponentType::create([
                'name' => $content['name'],
                'type' => $content['type'],
                'category' => $content['category'],
                'description' => $content['description'],
                'default_props' => $content['default_props'],
                'icon' => 'content-icon',
                'is_active' => true
            ]);
        }
    }

    private function createFooterComponents()
    {
        $footers = [
            [
                'name' => 'Modern Footer',
                'type' => 'footer_modern',
                'category' => 'footer',
                'description' => 'Multi-column footer with newsletter, links, and social media',
                'default_props' => [
                    'columns' => [
                        [
                            'title' => 'About Us',
                            'type' => 'text',
                            'content' => 'Your trusted online store for quality products.'
                        ],
                        [
                            'title' => 'Quick Links',
                            'type' => 'links',
                            'links' => [
                                ['label' => 'About', 'url' => '/about'],
                                ['label' => 'Contact', 'url' => '/contact'],
                                ['label' => 'Terms', 'url' => '/terms'],
                                ['label' => 'Privacy', 'url' => '/privacy']
                            ]
                        ],
                        [
                            'title' => 'Categories',
                            'type' => 'categories',
                            'dynamic' => true
                        ],
                        [
                            'title' => 'Newsletter',
                            'type' => 'newsletter',
                            'placeholder' => 'Enter your email',
                            'buttonText' => 'Subscribe'
                        ]
                    ],
                    'showSocial' => true,
                    'socialLinks' => [
                        ['platform' => 'facebook', 'url' => '#'],
                        ['platform' => 'twitter', 'url' => '#'],
                        ['platform' => 'instagram', 'url' => '#']
                    ],
                    'showPaymentMethods' => true,
                    'copyrightText' => '© 2024 Your Store. All rights reserved.',
                    'backgroundColor' => 'dark'
                ]
            ]
        ];

        foreach ($footers as $footer) {
            ComponentType::create([
                'name' => $footer['name'],
                'type' => $footer['type'],
                'category' => $footer['category'],
                'description' => $footer['description'],
                'default_props' => $footer['default_props'],
                'icon' => 'footer-icon',
                'is_active' => true
            ]);
        }
    }

    private function createEcommerceComponents()
    {
        $ecommerce = [
            [
                'name' => 'Add to Cart Button',
                'type' => 'add_to_cart',
                'category' => 'ecommerce',
                'description' => 'Customizable add to cart button',
                'default_props' => [
                    'productId' => null,
                    'text' => 'Add to Cart',
                    'style' => 'primary',
                    'size' => 'medium',
                    'showQuantity' => true,
                    'showPrice' => true
                ]
            ],
            [
                'name' => 'Mini Cart',
                'type' => 'mini_cart',
                'category' => 'ecommerce',
                'description' => 'Shopping cart preview dropdown',
                'default_props' => [
                    'position' => 'right',
                    'showSubtotal' => true,
                    'showCheckoutButton' => true,
                    'showViewCartButton' => true
                ]
            ],
            [
                'name' => 'Product Search',
                'type' => 'product_search',
                'category' => 'ecommerce',
                'description' => 'Search bar with instant results',
                'default_props' => [
                    'placeholder' => 'Search products...',
                    'showCategories' => true,
                    'showSuggestions' => true,
                    'maxResults' => 5
                ]
            ],
            [
                'name' => 'Price Filter',
                'type' => 'price_filter',
                'category' => 'ecommerce',
                'description' => 'Price range slider for filtering products',
                'default_props' => [
                    'minPrice' => 0,
                    'maxPrice' => 1000,
                    'step' => 10,
                    'currency' => 'USD'
                ]
            ],
            [
                'name' => 'Product Reviews',
                'type' => 'product_reviews',
                'category' => 'ecommerce',
                'description' => 'Display and submit product reviews',
                'default_props' => [
                    'productId' => null,
                    'showRating' => true,
                    'showForm' => true,
                    'requirePurchase' => false,
                    'sortBy' => 'recent'
                ]
            ],
            [
                'name' => 'Related Products',
                'type' => 'related_products',
                'category' => 'ecommerce',
                'description' => 'Show related or recommended products',
                'default_props' => [
                    'title' => 'You May Also Like',
                    'productId' => null,
                    'limit' => 4,
                    'algorithm' => 'category' // category, tags, purchase_history
                ]
            ],
            [
                'name' => 'Wishlist Button',
                'type' => 'wishlist_button',
                'category' => 'ecommerce',
                'description' => 'Add to wishlist functionality',
                'default_props' => [
                    'productId' => null,
                    'style' => 'icon', // icon, button, text
                    'activeColor' => 'red'
                ]
            ],
            [
                'name' => 'Product Quick View',
                'type' => 'product_quickview',
                'category' => 'ecommerce',
                'description' => 'Modal popup for quick product preview',
                'default_props' => [
                    'productId' => null,
                    'showGallery' => true,
                    'showDescription' => true,
                    'showAddToCart' => true
                ]
            ],
            [
                'name' => 'Discount Banner',
                'type' => 'discount_banner',
                'category' => 'ecommerce',
                'description' => 'Promotional banner with countdown timer',
                'default_props' => [
                    'title' => 'Limited Time Offer!',
                    'discount' => '20% OFF',
                    'code' => 'SAVE20',
                    'endDate' => null,
                    'showTimer' => true,
                    'style' => 'floating' // floating, inline, sticky
                ]
            ],
            [
                'name' => 'Customer Account',
                'type' => 'customer_account',
                'category' => 'ecommerce',
                'description' => 'Login/Register dropdown',
                'default_props' => [
                    'showAvatar' => true,
                    'showOrderHistory' => true,
                    'showWishlist' => true,
                    'showAddresses' => true
                ]
            ]
        ];

        foreach ($ecommerce as $component) {
            ComponentType::create([
                'name' => $component['name'],
                'type' => $component['type'],
                'category' => $component['category'],
                'description' => $component['description'],
                'default_props' => $component['default_props'],
                'icon' => 'ecommerce-icon',
                'is_active' => true
            ]);
        }
    }
}