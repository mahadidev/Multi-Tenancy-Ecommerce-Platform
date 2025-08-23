<?php

namespace App\Modules\WebsiteBuilder\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\WebsiteBuilder\Models\WebsiteTemplate;
use App\Modules\WebsiteBuilder\Models\TemplatePage;
use App\Modules\WebsiteBuilder\Models\TemplateSection;
use App\Modules\WebsiteBuilder\Models\TemplateComponent;
use App\Modules\WebsiteBuilder\Models\ComponentType;

class WebsiteTemplateSeeder extends Seeder
{
    public function run(): void
    {
        $this->createEcommerceTemplate();
        $this->createBusinessTemplate();
        $this->createMinimalTemplate();
    }

    private function createEcommerceTemplate(): void
    {
        $template = WebsiteTemplate::updateOrCreate(
            ['slug' => 'ecommerce-starter'],
            [
                'name' => 'E-commerce Starter',
                'slug' => 'ecommerce-starter',
                'description' => 'A complete e-commerce template with product showcase, hero banner, and contact form',
                'category' => 'ecommerce',
                'is_active' => true,
                'is_premium' => false,
                'price' => 0,
                'sort_order' => 1,
                'meta_data' => [
                    'features' => ['Product Grid', 'Hero Banner', 'Contact Form', 'Features Section'],
                    'pages' => ['Home', 'About', 'Contact'],
                ],
            ]
        );

        // Create Homepage
        $homepage = TemplatePage::updateOrCreate(
            ['template_id' => $template->id, 'slug' => 'home'],
            [
                'template_id' => $template->id,
                'title' => 'Home',
                'slug' => 'home',
                'type' => 'home',
                'description' => 'Homepage with hero banner and featured products',
                'is_homepage' => true,
                'sort_order' => 1,
            ]
        );

        // Hero Section
        $heroSection = TemplateSection::updateOrCreate(
            ['template_page_id' => $homepage->id, 'name' => 'Hero Section'],
            [
                'template_page_id' => $homepage->id,
                'name' => 'Hero Section',
                'type' => 'section',
                'sort_order' => 1,
            ]
        );

        $heroBannerType = ComponentType::where('slug', 'hero-banner')->first();
        if ($heroBannerType) {
            TemplateComponent::updateOrCreate(
                ['template_section_id' => $heroSection->id, 'component_type_id' => $heroBannerType->id],
                [
                    'template_section_id' => $heroSection->id,
                    'component_type_id' => $heroBannerType->id,
                    'name' => 'Main Hero',
                    'props' => [
                        'title' => 'Welcome to Our Store',
                        'subtitle' => 'Discover amazing products at unbeatable prices',
                        'buttonText' => 'Shop Now',
                        'buttonLink' => '/products',
                        'textAlign' => 'center',
                    ],
                    'sort_order' => 1,
                ]
            );
        }

        // Products Section
        $productsSection = TemplateSection::updateOrCreate(
            ['template_page_id' => $homepage->id, 'name' => 'Featured Products'],
            [
                'template_page_id' => $homepage->id,
                'name' => 'Featured Products',
                'type' => 'section',
                'sort_order' => 2,
            ]
        );

        $productGridType = ComponentType::where('slug', 'product-grid')->first();
        if ($productGridType) {
            TemplateComponent::updateOrCreate(
                ['template_section_id' => $productsSection->id, 'component_type_id' => $productGridType->id],
                [
                    'template_section_id' => $productsSection->id,
                    'component_type_id' => $productGridType->id,
                    'name' => 'Featured Products Grid',
                    'props' => [
                        'title' => 'Featured Products',
                        'limit' => 8,
                        'columns' => 4,
                        'filter' => 'featured',
                        'showPrice' => true,
                        'showDescription' => true,
                    ],
                    'sort_order' => 1,
                ]
            );
        }

        // Features Section
        $featuresSection = TemplateSection::updateOrCreate(
            ['template_page_id' => $homepage->id, 'name' => 'Why Choose Us'],
            [
                'template_page_id' => $homepage->id,
                'name' => 'Why Choose Us',
                'type' => 'section',
                'sort_order' => 3,
            ]
        );

        $featureListType = ComponentType::where('slug', 'feature-list')->first();
        if ($featureListType) {
            TemplateComponent::updateOrCreate(
                ['template_section_id' => $featuresSection->id, 'component_type_id' => $featureListType->id],
                [
                    'template_section_id' => $featuresSection->id,
                    'component_type_id' => $featureListType->id,
                    'name' => 'Store Features',
                    'props' => [
                        'title' => 'Why Choose Us',
                        'columns' => 3,
                        'features' => [
                            [
                                'icon' => '✓',
                                'title' => 'Quality Products',
                                'description' => 'We offer only the highest quality products from trusted brands',
                            ],
                            [
                                'icon' => '🚚',
                                'title' => 'Fast Shipping',
                                'description' => 'Quick and reliable delivery to your doorstep',
                            ],
                            [
                                'icon' => '💬',
                                'title' => '24/7 Support',
                                'description' => 'Round-the-clock customer service for all your needs',
                            ],
                        ],
                    ],
                    'sort_order' => 1,
                ]
            );
        }

        // Create About Page
        $aboutPage = TemplatePage::updateOrCreate(
            ['template_id' => $template->id, 'slug' => 'about'],
            [
                'template_id' => $template->id,
                'title' => 'About Us',
                'slug' => 'about',
                'type' => 'about',
                'description' => 'Learn more about our company and mission',
                'is_homepage' => false,
                'sort_order' => 2,
            ]
        );

        $aboutSection = TemplateSection::updateOrCreate(
            ['template_page_id' => $aboutPage->id, 'name' => 'About Content'],
            [
                'template_page_id' => $aboutPage->id,
                'name' => 'About Content',
                'type' => 'section',
                'sort_order' => 1,
            ]
        );

        $textBlockType = ComponentType::where('slug', 'text-block')->first();
        if ($textBlockType) {
            TemplateComponent::updateOrCreate(
                ['template_section_id' => $aboutSection->id, 'component_type_id' => $textBlockType->id],
                [
                    'template_section_id' => $aboutSection->id,
                    'component_type_id' => $textBlockType->id,
                    'name' => 'About Text',
                    'props' => [
                        'heading' => 'About Our Company',
                        'content' => 'We are a leading provider of quality products and exceptional customer service. Our mission is to deliver the best shopping experience for our customers while maintaining the highest standards of quality and integrity.',
                        'textAlign' => 'center',
                    ],
                    'sort_order' => 1,
                ]
            );
        }

        // Create Contact Page
        $contactPage = TemplatePage::updateOrCreate(
            ['template_id' => $template->id, 'slug' => 'contact'],
            [
                'template_id' => $template->id,
                'title' => 'Contact Us',
                'slug' => 'contact',
                'type' => 'contact',
                'description' => 'Get in touch with our team',
                'is_homepage' => false,
                'sort_order' => 3,
            ]
        );

        $contactSection = TemplateSection::updateOrCreate(
            ['template_page_id' => $contactPage->id, 'name' => 'Contact Form'],
            [
                'template_page_id' => $contactPage->id,
                'name' => 'Contact Form',
                'type' => 'section',
                'sort_order' => 1,
            ]
        );

        $contactFormType = ComponentType::where('slug', 'contact-form')->first();
        if ($contactFormType) {
            TemplateComponent::updateOrCreate(
                ['template_section_id' => $contactSection->id, 'component_type_id' => $contactFormType->id],
                [
                    'template_section_id' => $contactSection->id,
                    'component_type_id' => $contactFormType->id,
                    'name' => 'Main Contact Form',
                    'props' => [
                        'title' => 'Get In Touch',
                        'submitText' => 'Send Message',
                        'showName' => true,
                        'showEmail' => true,
                        'showPhone' => true,
                        'showSubject' => true,
                        'showMessage' => true,
                    ],
                    'sort_order' => 1,
                ]
            );
        }
    }

    private function createBusinessTemplate(): void
    {
        $template = WebsiteTemplate::updateOrCreate(
            ['slug' => 'business-pro'],
            [
                'name' => 'Business Pro',
                'slug' => 'business-pro',
                'description' => 'Professional business template with testimonials and service features',
                'category' => 'business',
                'is_active' => true,
                'is_premium' => true,
                'price' => 29.99,
                'sort_order' => 2,
                'meta_data' => [
                    'features' => ['Hero Banner', 'Services', 'Testimonials', 'Contact Form'],
                    'pages' => ['Home', 'Services', 'About', 'Contact'],
                ],
            ]
        );

        // Create a basic homepage for business template
        $homepage = TemplatePage::updateOrCreate(
            ['template_id' => $template->id, 'slug' => 'home'],
            [
                'template_id' => $template->id,
                'title' => 'Home',
                'slug' => 'home',
                'type' => 'home',
                'description' => 'Professional business homepage',
                'is_homepage' => true,
                'sort_order' => 1,
            ]
        );

        $heroSection = TemplateSection::updateOrCreate(
            ['template_page_id' => $homepage->id, 'name' => 'Hero Section'],
            [
                'template_page_id' => $homepage->id,
                'name' => 'Hero Section',
                'type' => 'section',
                'sort_order' => 1,
            ]
        );

        $heroBannerType = ComponentType::where('slug', 'hero-banner')->first();
        if ($heroBannerType) {
            TemplateComponent::updateOrCreate(
                ['template_section_id' => $heroSection->id, 'component_type_id' => $heroBannerType->id],
                [
                    'template_section_id' => $heroSection->id,
                    'component_type_id' => $heroBannerType->id,
                    'name' => 'Business Hero',
                    'props' => [
                        'title' => 'Professional Business Solutions',
                        'subtitle' => 'We help businesses grow and succeed with our expert services',
                        'buttonText' => 'Learn More',
                        'buttonLink' => '/services',
                        'textAlign' => 'center',
                    ],
                    'sort_order' => 1,
                ]
            );
        }
    }

    private function createMinimalTemplate(): void
    {
        $template = WebsiteTemplate::updateOrCreate(
            ['slug' => 'minimal-clean'],
            [
                'name' => 'Minimal Clean',
                'slug' => 'minimal-clean',
                'description' => 'Clean and minimal template perfect for portfolios and simple websites',
                'category' => 'portfolio',
                'is_active' => true,
                'is_premium' => false,
                'price' => 0,
                'sort_order' => 3,
                'meta_data' => [
                    'features' => ['Clean Design', 'Text Content', 'Contact Form'],
                    'pages' => ['Home', 'About', 'Contact'],
                ],
            ]
        );

        // Create basic homepage
        $homepage = TemplatePage::updateOrCreate(
            ['template_id' => $template->id, 'slug' => 'home'],
            [
                'template_id' => $template->id,
                'title' => 'Home',
                'slug' => 'home',
                'type' => 'home',
                'description' => 'Minimal homepage design',
                'is_homepage' => true,
                'sort_order' => 1,
            ]
        );

        $contentSection = TemplateSection::updateOrCreate(
            ['template_page_id' => $homepage->id, 'name' => 'Main Content'],
            [
                'template_page_id' => $homepage->id,
                'name' => 'Main Content',
                'type' => 'section',
                'sort_order' => 1,
            ]
        );

        $textBlockType = ComponentType::where('slug', 'text-block')->first();
        if ($textBlockType) {
            TemplateComponent::updateOrCreate(
                ['template_section_id' => $contentSection->id, 'component_type_id' => $textBlockType->id],
                [
                    'template_section_id' => $contentSection->id,
                    'component_type_id' => $textBlockType->id,
                    'name' => 'Welcome Text',
                    'props' => [
                        'heading' => 'Welcome',
                        'content' => 'This is a clean and minimal website template. Perfect for showcasing your content in a simple, elegant way.',
                        'textAlign' => 'center',
                    ],
                    'sort_order' => 1,
                ]
            );
        }
    }
}