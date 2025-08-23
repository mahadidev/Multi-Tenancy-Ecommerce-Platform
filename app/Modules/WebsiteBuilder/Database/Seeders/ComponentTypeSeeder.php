<?php

namespace App\Modules\WebsiteBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\WebsiteBuilder\Models\ComponentCategory;
use App\Modules\WebsiteBuilder\Models\ComponentType;

class ComponentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $this->createHeroComponents();
        $this->createContentComponents();
        $this->createEcommerceComponents();
        $this->createMediaComponents();
        $this->createFormComponents();
        $this->createFeatureComponents();
        $this->createTestimonialComponents();
    }

    private function createHeroComponents(): void
    {
        $heroCategory = ComponentCategory::where('slug', 'heroes')->first();
        if (!$heroCategory) return;

        $components = [
            [
                'category_id' => $heroCategory->id,
                'name' => 'Hero Banner',
                'slug' => 'hero-banner',
                'description' => 'Main hero section with title, subtitle, and call-to-action button',
                'icon' => 'hero',
                'default_props' => [
                    'title' => 'Welcome to Our Store',
                    'subtitle' => 'Discover amazing products at great prices',
                    'buttonText' => 'Shop Now',
                    'buttonLink' => '/products',
                    'backgroundImage' => '',
                    'textAlign' => 'center',
                ],
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'title' => [
                            'type' => 'string',
                            'title' => 'Title',
                            'description' => 'Main heading text',
                        ],
                        'subtitle' => [
                            'type' => 'string',
                            'title' => 'Subtitle',
                            'description' => 'Supporting text below the title',
                        ],
                        'buttonText' => [
                            'type' => 'string',
                            'title' => 'Button Text',
                            'description' => 'Text for the call-to-action button',
                        ],
                        'buttonLink' => [
                            'type' => 'string',
                            'title' => 'Button Link',
                            'description' => 'URL for the button',
                        ],
                        'backgroundImage' => [
                            'type' => 'string',
                            'title' => 'Background Image',
                            'description' => 'URL of the background image',
                            'format' => 'image',
                        ],
                        'textAlign' => [
                            'type' => 'string',
                            'title' => 'Text Alignment',
                            'enum' => ['left', 'center', 'right'],
                            'default' => 'center',
                        ],
                    ],
                    'required' => ['title'],
                ],
                'template' => '<div class="hero-banner" style="background-image: url({{backgroundImage}}); text-align: {{textAlign}};">
                    <div class="hero-content">
                        <h1 class="hero-title">{{title}}</h1>
                        <p class="hero-subtitle">{{subtitle}}</p>
                        <a href="{{buttonLink}}" class="hero-button">{{buttonText}}</a>
                    </div>
                </div>',
                'styles' => [
                    '.hero-banner' => [
                        'padding' => '100px 20px',
                        'background-size' => 'cover',
                        'background-position' => 'center',
                        'min-height' => '500px',
                        'display' => 'flex',
                        'align-items' => 'center',
                        'justify-content' => 'center',
                    ],
                    '.hero-content' => [
                        'max-width' => '800px',
                        'margin' => '0 auto',
                    ],
                    '.hero-title' => [
                        'font-size' => '3rem',
                        'font-weight' => 'bold',
                        'margin-bottom' => '1rem',
                        'color' => '#ffffff',
                    ],
                    '.hero-subtitle' => [
                        'font-size' => '1.25rem',
                        'margin-bottom' => '2rem',
                        'color' => '#ffffff',
                    ],
                    '.hero-button' => [
                        'display' => 'inline-block',
                        'padding' => '12px 24px',
                        'background-color' => '#007bff',
                        'color' => '#ffffff',
                        'text-decoration' => 'none',
                        'border-radius' => '5px',
                        'font-weight' => 'bold',
                    ],
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
        ];

        foreach ($components as $component) {
            ComponentType::updateOrCreate(
                ['slug' => $component['slug']],
                $component
            );
        }
    }

    private function createContentComponents(): void
    {
        $contentCategory = ComponentCategory::where('slug', 'content')->first();
        if (!$contentCategory) return;

        $components = [
            [
                'category_id' => $contentCategory->id,
                'name' => 'Text Block',
                'slug' => 'text-block',
                'description' => 'Simple text content with heading and paragraph',
                'icon' => 'text',
                'default_props' => [
                    'heading' => 'About Us',
                    'content' => 'We are a leading provider of quality products and services.',
                    'textAlign' => 'left',
                ],
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'heading' => [
                            'type' => 'string',
                            'title' => 'Heading',
                        ],
                        'content' => [
                            'type' => 'string',
                            'title' => 'Content',
                            'format' => 'textarea',
                        ],
                        'textAlign' => [
                            'type' => 'string',
                            'title' => 'Text Alignment',
                            'enum' => ['left', 'center', 'right'],
                            'default' => 'left',
                        ],
                    ],
                    'required' => ['content'],
                ],
                'template' => '<div class="text-block" style="text-align: {{textAlign}};">
                    {{#if heading}}<h2 class="text-heading">{{heading}}</h2>{{/if}}
                    <div class="text-content">{{content}}</div>
                </div>',
                'styles' => [
                    '.text-block' => [
                        'padding' => '40px 20px',
                        'max-width' => '800px',
                        'margin' => '0 auto',
                    ],
                    '.text-heading' => [
                        'font-size' => '2rem',
                        'margin-bottom' => '1rem',
                        'color' => '#333333',
                    ],
                    '.text-content' => [
                        'font-size' => '1rem',
                        'line-height' => '1.6',
                        'color' => '#666666',
                    ],
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
        ];

        foreach ($components as $component) {
            ComponentType::updateOrCreate(
                ['slug' => $component['slug']],
                $component
            );
        }
    }

    private function createEcommerceComponents(): void
    {
        $ecommerceCategory = ComponentCategory::where('slug', 'ecommerce')->first();
        if (!$ecommerceCategory) return;

        $components = [
            [
                'category_id' => $ecommerceCategory->id,
                'name' => 'Product Grid',
                'slug' => 'product-grid',
                'description' => 'Display products in a responsive grid layout',
                'icon' => 'grid',
                'default_props' => [
                    'title' => 'Featured Products',
                    'limit' => 8,
                    'columns' => 4,
                    'showPrice' => true,
                    'showDescription' => true,
                    'filter' => 'featured', // featured, latest, trending
                ],
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'title' => [
                            'type' => 'string',
                            'title' => 'Section Title',
                        ],
                        'limit' => [
                            'type' => 'number',
                            'title' => 'Number of Products',
                            'minimum' => 1,
                            'maximum' => 50,
                            'default' => 8,
                        ],
                        'columns' => [
                            'type' => 'number',
                            'title' => 'Columns',
                            'enum' => [2, 3, 4, 6],
                            'default' => 4,
                        ],
                        'filter' => [
                            'type' => 'string',
                            'title' => 'Product Filter',
                            'enum' => ['featured', 'latest', 'trending', 'all'],
                            'default' => 'featured',
                        ],
                        'showPrice' => [
                            'type' => 'boolean',
                            'title' => 'Show Price',
                            'default' => true,
                        ],
                        'showDescription' => [
                            'type' => 'boolean',
                            'title' => 'Show Description',
                            'default' => true,
                        ],
                    ],
                ],
                'template' => '<div class="product-grid">
                    {{#if title}}<h2 class="section-title">{{title}}</h2>{{/if}}
                    <div class="products" data-columns="{{columns}}" data-limit="{{limit}}" data-filter="{{filter}}">
                        <!-- Products will be dynamically loaded -->
                    </div>
                </div>',
                'styles' => [
                    '.product-grid' => [
                        'padding' => '60px 20px',
                    ],
                    '.section-title' => [
                        'text-align' => 'center',
                        'font-size' => '2.5rem',
                        'margin-bottom' => '3rem',
                        'color' => '#333333',
                    ],
                    '.products' => [
                        'display' => 'grid',
                        'gap' => '30px',
                        'grid-template-columns' => 'repeat(auto-fit, minmax(250px, 1fr))',
                    ],
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
        ];

        foreach ($components as $component) {
            ComponentType::updateOrCreate(
                ['slug' => $component['slug']],
                $component
            );
        }
    }

    private function createMediaComponents(): void
    {
        $mediaCategory = ComponentCategory::where('slug', 'media')->first();
        if (!$mediaCategory) return;

        $components = [
            [
                'category_id' => $mediaCategory->id,
                'name' => 'Image',
                'slug' => 'image',
                'description' => 'Single image with optional caption',
                'icon' => 'image',
                'default_props' => [
                    'src' => '',
                    'alt' => '',
                    'caption' => '',
                    'width' => '100%',
                    'alignment' => 'center',
                ],
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'src' => [
                            'type' => 'string',
                            'title' => 'Image URL',
                            'format' => 'image',
                        ],
                        'alt' => [
                            'type' => 'string',
                            'title' => 'Alt Text',
                            'description' => 'Alternative text for accessibility',
                        ],
                        'caption' => [
                            'type' => 'string',
                            'title' => 'Caption',
                            'description' => 'Optional image caption',
                        ],
                        'width' => [
                            'type' => 'string',
                            'title' => 'Width',
                            'enum' => ['25%', '50%', '75%', '100%'],
                            'default' => '100%',
                        ],
                        'alignment' => [
                            'type' => 'string',
                            'title' => 'Alignment',
                            'enum' => ['left', 'center', 'right'],
                            'default' => 'center',
                        ],
                    ],
                    'required' => ['src'],
                ],
                'template' => '<div class="image-component" style="text-align: {{alignment}};">
                    <img src="{{src}}" alt="{{alt}}" style="width: {{width}}; max-width: 100%;" />
                    {{#if caption}}<p class="image-caption">{{caption}}</p>{{/if}}
                </div>',
                'styles' => [
                    '.image-component' => [
                        'padding' => '20px',
                    ],
                    '.image-caption' => [
                        'margin-top' => '10px',
                        'font-style' => 'italic',
                        'color' => '#666666',
                        'font-size' => '0.9rem',
                    ],
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
        ];

        foreach ($components as $component) {
            ComponentType::updateOrCreate(
                ['slug' => $component['slug']],
                $component
            );
        }
    }

    private function createFormComponents(): void
    {
        $formCategory = ComponentCategory::where('slug', 'forms')->first();
        if (!$formCategory) return;

        $components = [
            [
                'category_id' => $formCategory->id,
                'name' => 'Contact Form',
                'slug' => 'contact-form',
                'description' => 'Simple contact form with name, email, and message',
                'icon' => 'form',
                'default_props' => [
                    'title' => 'Contact Us',
                    'submitText' => 'Send Message',
                    'showName' => true,
                    'showEmail' => true,
                    'showPhone' => false,
                    'showSubject' => true,
                    'showMessage' => true,
                ],
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'title' => [
                            'type' => 'string',
                            'title' => 'Form Title',
                        ],
                        'submitText' => [
                            'type' => 'string',
                            'title' => 'Submit Button Text',
                            'default' => 'Send Message',
                        ],
                        'showName' => [
                            'type' => 'boolean',
                            'title' => 'Show Name Field',
                            'default' => true,
                        ],
                        'showEmail' => [
                            'type' => 'boolean',
                            'title' => 'Show Email Field',
                            'default' => true,
                        ],
                        'showPhone' => [
                            'type' => 'boolean',
                            'title' => 'Show Phone Field',
                            'default' => false,
                        ],
                        'showSubject' => [
                            'type' => 'boolean',
                            'title' => 'Show Subject Field',
                            'default' => true,
                        ],
                        'showMessage' => [
                            'type' => 'boolean',
                            'title' => 'Show Message Field',
                            'default' => true,
                        ],
                    ],
                ],
                'template' => '<div class="contact-form">
                    {{#if title}}<h2 class="form-title">{{title}}</h2>{{/if}}
                    <form class="form" data-form-type="contact">
                        {{#if showName}}<input type="text" name="name" placeholder="Your Name" required />{{/if}}
                        {{#if showEmail}}<input type="email" name="email" placeholder="Your Email" required />{{/if}}
                        {{#if showPhone}}<input type="tel" name="phone" placeholder="Your Phone" />{{/if}}
                        {{#if showSubject}}<input type="text" name="subject" placeholder="Subject" />{{/if}}
                        {{#if showMessage}}<textarea name="message" placeholder="Your Message" rows="5" required></textarea>{{/if}}
                        <button type="submit">{{submitText}}</button>
                    </form>
                </div>',
                'styles' => [
                    '.contact-form' => [
                        'padding' => '60px 20px',
                        'max-width' => '600px',
                        'margin' => '0 auto',
                    ],
                    '.form-title' => [
                        'text-align' => 'center',
                        'margin-bottom' => '2rem',
                        'font-size' => '2rem',
                        'color' => '#333333',
                    ],
                    '.form input, .form textarea' => [
                        'width' => '100%',
                        'padding' => '12px',
                        'margin-bottom' => '1rem',
                        'border' => '1px solid #ddd',
                        'border-radius' => '5px',
                        'font-size' => '1rem',
                    ],
                    '.form button' => [
                        'width' => '100%',
                        'padding' => '12px',
                        'background-color' => '#007bff',
                        'color' => '#ffffff',
                        'border' => 'none',
                        'border-radius' => '5px',
                        'font-size' => '1rem',
                        'cursor' => 'pointer',
                    ],
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
        ];

        foreach ($components as $component) {
            ComponentType::updateOrCreate(
                ['slug' => $component['slug']],
                $component
            );
        }
    }

    private function createFeatureComponents(): void
    {
        $featureCategory = ComponentCategory::where('slug', 'features')->first();
        if (!$featureCategory) return;

        $components = [
            [
                'category_id' => $featureCategory->id,
                'name' => 'Feature List',
                'slug' => 'feature-list',
                'description' => 'List of features with icons and descriptions',
                'icon' => 'list',
                'default_props' => [
                    'title' => 'Why Choose Us',
                    'features' => [
                        [
                            'icon' => 'check',
                            'title' => 'Quality Products',
                            'description' => 'We offer only the highest quality products',
                        ],
                        [
                            'icon' => 'truck',
                            'title' => 'Fast Shipping',
                            'description' => 'Quick and reliable delivery to your door',
                        ],
                        [
                            'icon' => 'support',
                            'title' => '24/7 Support',
                            'description' => 'Round-the-clock customer service',
                        ],
                    ],
                    'columns' => 3,
                ],
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'title' => [
                            'type' => 'string',
                            'title' => 'Section Title',
                        ],
                        'columns' => [
                            'type' => 'number',
                            'title' => 'Columns',
                            'enum' => [1, 2, 3, 4],
                            'default' => 3,
                        ],
                        'features' => [
                            'type' => 'array',
                            'title' => 'Features',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'icon' => [
                                        'type' => 'string',
                                        'title' => 'Icon',
                                    ],
                                    'title' => [
                                        'type' => 'string',
                                        'title' => 'Feature Title',
                                    ],
                                    'description' => [
                                        'type' => 'string',
                                        'title' => 'Description',
                                    ],
                                ],
                                'required' => ['title'],
                            ],
                        ],
                    ],
                ],
                'template' => '<div class="feature-list">
                    {{#if title}}<h2 class="section-title">{{title}}</h2>{{/if}}
                    <div class="features" data-columns="{{columns}}">
                        {{#each features}}
                        <div class="feature-item">
                            {{#if icon}}<div class="feature-icon">{{icon}}</div>{{/if}}
                            <h3 class="feature-title">{{title}}</h3>
                            <p class="feature-description">{{description}}</p>
                        </div>
                        {{/each}}
                    </div>
                </div>',
                'styles' => [
                    '.feature-list' => [
                        'padding' => '60px 20px',
                    ],
                    '.section-title' => [
                        'text-align' => 'center',
                        'margin-bottom' => '3rem',
                        'font-size' => '2.5rem',
                        'color' => '#333333',
                    ],
                    '.features' => [
                        'display' => 'grid',
                        'gap' => '30px',
                        'grid-template-columns' => 'repeat(auto-fit, minmax(250px, 1fr))',
                    ],
                    '.feature-item' => [
                        'text-align' => 'center',
                        'padding' => '20px',
                    ],
                    '.feature-icon' => [
                        'font-size' => '3rem',
                        'margin-bottom' => '1rem',
                        'color' => '#007bff',
                    ],
                    '.feature-title' => [
                        'font-size' => '1.5rem',
                        'margin-bottom' => '1rem',
                        'color' => '#333333',
                    ],
                    '.feature-description' => [
                        'color' => '#666666',
                        'line-height' => '1.6',
                    ],
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
        ];

        foreach ($components as $component) {
            ComponentType::updateOrCreate(
                ['slug' => $component['slug']],
                $component
            );
        }
    }

    private function createTestimonialComponents(): void
    {
        $testimonialCategory = ComponentCategory::where('slug', 'testimonials')->first();
        if (!$testimonialCategory) return;

        $components = [
            [
                'category_id' => $testimonialCategory->id,
                'name' => 'Testimonial Slider',
                'slug' => 'testimonial-slider',
                'description' => 'Customer testimonials in a slider format',
                'icon' => 'quote',
                'default_props' => [
                    'title' => 'What Our Customers Say',
                    'testimonials' => [
                        [
                            'quote' => 'Amazing products and excellent service. Highly recommended!',
                            'author' => 'John Doe',
                            'position' => 'CEO, Company Inc.',
                            'avatar' => '',
                        ],
                        [
                            'quote' => 'Fast delivery and great quality. Will definitely order again.',
                            'author' => 'Jane Smith',
                            'position' => 'Marketing Manager',
                            'avatar' => '',
                        ],
                    ],
                    'autoPlay' => true,
                    'showDots' => true,
                ],
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        'title' => [
                            'type' => 'string',
                            'title' => 'Section Title',
                        ],
                        'autoPlay' => [
                            'type' => 'boolean',
                            'title' => 'Auto Play',
                            'default' => true,
                        ],
                        'showDots' => [
                            'type' => 'boolean',
                            'title' => 'Show Navigation Dots',
                            'default' => true,
                        ],
                        'testimonials' => [
                            'type' => 'array',
                            'title' => 'Testimonials',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'quote' => [
                                        'type' => 'string',
                                        'title' => 'Quote',
                                    ],
                                    'author' => [
                                        'type' => 'string',
                                        'title' => 'Author Name',
                                    ],
                                    'position' => [
                                        'type' => 'string',
                                        'title' => 'Position/Company',
                                    ],
                                    'avatar' => [
                                        'type' => 'string',
                                        'title' => 'Avatar Image',
                                        'format' => 'image',
                                    ],
                                ],
                                'required' => ['quote', 'author'],
                            ],
                        ],
                    ],
                ],
                'template' => '<div class="testimonial-slider">
                    {{#if title}}<h2 class="section-title">{{title}}</h2>{{/if}}
                    <div class="testimonials" data-autoplay="{{autoPlay}}" data-dots="{{showDots}}">
                        {{#each testimonials}}
                        <div class="testimonial-item">
                            <blockquote class="testimonial-quote">"{{quote}}"</blockquote>
                            <div class="testimonial-author">
                                {{#if avatar}}<img src="{{avatar}}" alt="{{author}}" class="author-avatar" />{{/if}}
                                <div class="author-info">
                                    <div class="author-name">{{author}}</div>
                                    {{#if position}}<div class="author-position">{{position}}</div>{{/if}}
                                </div>
                            </div>
                        </div>
                        {{/each}}
                    </div>
                </div>',
                'styles' => [
                    '.testimonial-slider' => [
                        'padding' => '60px 20px',
                        'background-color' => '#f8f9fa',
                    ],
                    '.section-title' => [
                        'text-align' => 'center',
                        'margin-bottom' => '3rem',
                        'font-size' => '2.5rem',
                        'color' => '#333333',
                    ],
                    '.testimonial-item' => [
                        'text-align' => 'center',
                        'max-width' => '600px',
                        'margin' => '0 auto',
                        'padding' => '2rem',
                    ],
                    '.testimonial-quote' => [
                        'font-size' => '1.25rem',
                        'font-style' => 'italic',
                        'margin-bottom' => '2rem',
                        'color' => '#333333',
                        'line-height' => '1.6',
                    ],
                    '.testimonial-author' => [
                        'display' => 'flex',
                        'align-items' => 'center',
                        'justify-content' => 'center',
                        'gap' => '1rem',
                    ],
                    '.author-avatar' => [
                        'width' => '60px',
                        'height' => '60px',
                        'border-radius' => '50%',
                        'object-fit' => 'cover',
                    ],
                    '.author-name' => [
                        'font-weight' => 'bold',
                        'color' => '#333333',
                    ],
                    '.author-position' => [
                        'color' => '#666666',
                        'font-size' => '0.9rem',
                    ],
                ],
                'is_active' => true,
                'sort_order' => 1,
            ],
        ];

        foreach ($components as $component) {
            ComponentType::updateOrCreate(
                ['slug' => $component['slug']],
                $component
            );
        }
    }
}