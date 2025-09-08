<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\Theme;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsitePage;
use App\Modules\WebsiteBuilder\Models\PageSection;
use App\Modules\WebsiteBuilder\Models\PageComponent;
use App\Modules\WebsiteBuilder\Models\ComponentType;
use App\Modules\WebsiteBuilder\Models\ThemeCustomization;
use App\Modules\WebsiteBuilder\Models\SellerTheme;
use App\Modules\WebsiteBuilder\Jobs\InstallThemeJob;
use App\Modules\WebsiteBuilder\Events\ThemeInstallationStarted;
use App\Modules\WebsiteBuilder\Events\ThemeInstallationCompleted;
use App\Modules\WebsiteBuilder\Events\ThemeInstallationFailed;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Carbon\Carbon;

class ThemeInstallationService
{
    protected ThemeLoader $themeLoader;
    protected ComponentService $componentService;

    public function __construct(
        ThemeLoader $themeLoader,
        ComponentService $componentService
    ) {
        $this->themeLoader = $themeLoader;
        $this->componentService = $componentService;
    }

    /**
     * Install theme for a website with comprehensive error handling and progress tracking
     */
    public function installTheme(array $options): array
    {
        $websiteId = $options['website_id'];
        $themeSlug = $options['theme_slug'];
        $overwriteExisting = $options['overwrite_existing'] ?? false;
        $createDemoContent = $options['create_demo_content'] ?? true;
        
        try {
            DB::beginTransaction();
            
            // Set installation status
            $this->setInstallationStatus($websiteId, 'started', 0);
            
            Event::dispatch(new ThemeInstallationStarted($websiteId, $themeSlug));

            // 1. Validate theme and website
            $website = StoreWebsite::findOrFail($websiteId);
            $theme = Theme::where('slug', $themeSlug)->where('is_active', true)->firstOrFail();
            
            // 2. Install theme settings (10% progress)
            $this->installThemeSettings($website, $theme);
            $this->updateInstallationProgress($websiteId, 'theme-settings', 10);

            // 3. Create theme pages (40% progress)
            $createdPages = $this->createThemePages($website, $theme, $overwriteExisting);
            $this->updateInstallationProgress($websiteId, 'pages', 40);

            // 4. Build sections and components (70% progress)
            $this->buildSectionsAndComponents($createdPages, $theme);
            $this->updateInstallationProgress($websiteId, 'sections', 70);

            // 5. Create demo content if requested (90% progress)
            if ($createDemoContent) {
                $this->createDemoContent($website);
            }
            $this->updateInstallationProgress($websiteId, 'demo-content', 90);

            // 6. Finalize installation (100% progress)
            $this->finalizeInstallation($website, $theme);
            $this->updateInstallationProgress($websiteId, 'finalization', 100);

            DB::commit();
            
            Event::dispatch(new ThemeInstallationCompleted($websiteId, $themeSlug, count($createdPages)));

            return [
                'success' => true,
                'pages' => $createdPages,
                'message' => 'Theme installed successfully',
                'created_pages_count' => count($createdPages),
                'errors' => []
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Theme installation failed', [
                'website_id' => $websiteId,
                'theme_slug' => $themeSlug,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            $this->setInstallationStatus($websiteId, 'failed', 0, [$e->getMessage()]);
            
            Event::dispatch(new ThemeInstallationFailed($websiteId, $themeSlug, $e->getMessage()));

            return [
                'success' => false,
                'pages' => [],
                'message' => 'Theme installation failed',
                'errors' => [$e->getMessage()]
            ];
        }
    }

    /**
     * Install theme in background using queue
     */
    public function installThemeAsync(array $options): string
    {
        $jobId = uniqid('theme_install_', true);
        
        // Set initial status
        $this->setInstallationStatus($options['website_id'], 'queued', 0);
        
        // Dispatch job
        InstallThemeJob::dispatch($options)->onQueue('theme-installation');
        
        return $jobId;
    }

    /**
     * Install theme settings and global configuration
     */
    protected function installThemeSettings(StoreWebsite $website, Theme $theme): void
    {
        // Update website with theme
        $website->update([
            'theme_id' => $theme->id,
            'meta_data' => array_merge($website->meta_data ?? [], [
                'theme_installation' => [
                    'theme_id' => $theme->id,
                    'theme_slug' => $theme->slug,
                    'theme_version' => $theme->version,
                    'installed_at' => now()->toISOString()
                ]
            ])
        ]);

        // Create or update theme customization
        $customization = ThemeCustomization::updateOrCreate(
            [
                'store_id' => $website->store_id,
                'theme_id' => $theme->id,
                'is_active' => true
            ],
            [
                'name' => 'Default ' . $theme->name,
                'colors' => $theme->layouts['default']['colors'] ?? [],
                'fonts' => $theme->layouts['default']['fonts'] ?? [],
                'settings' => $theme->config_schema ?? []
            ]
        );

        $website->update(['theme_customization_id' => $customization->id]);

        // Install SellerTheme relationship  
        SellerTheme::updateOrCreate(
            [
                'seller_id' => $website->store->owner_id,
                'theme_id' => $theme->id,
            ],
            [
                'is_active' => true,
                'activated_at' => now()
            ]
        );
    }

    /**
     * Create all theme pages with their structure
     */
    protected function createThemePages(StoreWebsite $website, Theme $theme, bool $overwriteExisting): array
    {
        $createdPages = [];
        $themePages = $this->getThemePages($theme);

        foreach ($themePages as $pageData) {
            // Check if page exists
            if (!$overwriteExisting) {
                $existingPage = WebsitePage::where('website_id', $website->id)
                    ->where('slug', $pageData['slug'])
                    ->first();
                    
                if ($existingPage) {
                    continue; // Skip existing pages
                }
            }

            // Create or update page
            $page = WebsitePage::updateOrCreate(
                [
                    'website_id' => $website->id,
                    'slug' => $pageData['slug']
                ],
                [
                    'title' => $pageData['title'],
                    'content' => $pageData['content'] ?? '',
                    'is_published' => true,
                    'type' => $pageData['type'] ?? 'page',
                    'sort_order' => $pageData['sort_order'] ?? 0,
                    'access_level' => $pageData['access_level'] ?? 'all',
                    'seo_meta' => [
                        'title' => $pageData['seo']['title'] ?? $pageData['title'],
                        'description' => $pageData['seo']['description'] ?? '',
                        'keywords' => $pageData['seo']['keywords'] ?? []
                    ],
                    'meta_data' => [
                        'theme_page' => true,
                        'theme_slug' => $theme->slug,
                        'page_structure' => $pageData['structure'] ?? [],
                        'template' => $pageData['template'] ?? 'default'
                    ]
                ]
            );

            $createdPages[] = [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'type' => $page->type,
                'sections_count' => count($pageData['sections'] ?? [])
            ];
        }

        return $createdPages;
    }

    /**
     * Build sections and components for created pages
     */
    protected function buildSectionsAndComponents(array $createdPages, Theme $theme): void
    {
        $themePages = $this->getThemePages($theme);
        
        foreach ($createdPages as $pageInfo) {
            $page = WebsitePage::find($pageInfo['id']);
            $pageData = collect($themePages)->firstWhere('slug', $page->slug);
            
            if (!$pageData || !isset($pageData['sections'])) {
                continue;
            }

            // Clear existing sections if overwriting
            $page->sections()->delete();

            // Create sections and components
            foreach ($pageData['sections'] as $index => $sectionData) {
                $section = PageSection::create([
                    'page_id' => $page->id,
                    'name' => $sectionData['name'] ?? "Section " . ($index + 1),
                    'type' => $sectionData['type'] ?? 'content',
                    'sort_order' => $index,
                    'is_visible' => true,
                    'settings' => $sectionData['settings'] ?? [],
                    'responsive_settings' => $sectionData['responsive'] ?? []
                ]);

                // Create components within section
                $this->createSectionComponents($section, $sectionData['components'] ?? []);
            }

            // Convert sections and components to page builder JSON format
            $this->updatePageContent($page);
        }
    }

    /**
     * Convert sections and components to page builder JSON format and update page content
     */
    protected function updatePageContent(WebsitePage $page): void
    {
        $sections = $page->sections()->with('components.componentType')->orderBy('sort_order')->get();
        
        $pageBuilderSections = [];
        
        foreach ($sections as $section) {
            $widgets = [];
            
            foreach ($section->components as $component) {
                $widgets[] = [
                    'type' => $component->componentType->slug ?? $component->name,
                    'content' => $component->props,
                    'settings' => $component->styles,
                    'id' => 'widget-' . $component->id
                ];
            }
            
            // Create a single column containing all widgets for this section
            $pageBuilderSections[] = [
                'id' => 'section-' . $section->id,
                'columns' => [
                    [
                        'id' => 'column-' . $section->id . '-0',
                        'widgets' => $widgets,
                        'settings' => [
                            'desktop' => array_merge([
                                'width' => 100,
                                'padding' => '20px',
                                'backgroundColor' => 'transparent'
                            ], $section->settings ?? [])
                        ]
                    ]
                ],
                'settings' => [
                    'desktop' => array_merge([
                        'layout' => 'boxed',
                        'contentWidth' => '1140px', 
                        'backgroundColor' => 'transparent',
                        'padding' => '60px 20px',
                        'margin' => '0',
                        'columnsPerRow' => 1,
                        'columnGap' => '1rem',
                        'rowGap' => '1rem',
                        'alignItems' => 'stretch'
                    ], $section->settings ?? []),
                    'tablet' => ['columnsPerRow' => 1],
                    'mobile' => ['columnsPerRow' => 1]
                ]
            ];
        }
        
        $pageBuilderContent = [
            'sections' => $pageBuilderSections,
            'deviceSettings' => [
                'desktop' => [],
                'tablet' => [],
                'mobile' => []
            ],
            'saved_at' => now()->toISOString(),
            'version' => '1.0'
        ];
        
        $page->update(['content' => json_encode($pageBuilderContent)]);
    }

    /**
     * Create components for a section
     */
    protected function createSectionComponents(PageSection $section, array $components): void
    {
        foreach ($components as $index => $componentData) {
            $componentType = $this->getOrCreateComponentType($componentData['type']);

            PageComponent::create([
                'section_id' => $section->id,
                'component_type_id' => $componentType->id,
                'name' => $componentData['name'] ?? $componentData['type'],
                'sort_order' => $index,
                'is_visible' => true,
                'props' => $componentData['props'] ?? [],
                'styles' => $componentData['styles'] ?? [],
                'responsive_settings' => $componentData['responsive'] ?? [],
                'animation_settings' => $componentData['animations'] ?? [],
                'meta_data' => [
                    'component_version' => $componentData['version'] ?? '1.0',
                    'theme_component' => true
                ]
            ]);
        }
    }

    /**
     * Get or create component type
     */
    protected function getOrCreateComponentType(string $typeName): ComponentType
    {
        return ComponentType::firstOrCreate(
            ['slug' => $typeName],
            [
                'name' => $typeName,
                'display_name' => ucwords(str_replace(['-', '_'], ' ', $typeName)),
                'description' => "Auto-generated component type for {$typeName}",
                'icon' => 'component',
                'category_id' => 1, // Default category, should be adjusted based on your categories
                'props_schema' => [
                    'type' => 'object',
                    'properties' => []
                ],
                'is_active' => true
            ]
        );
    }

    /**
     * Create demo content (products, categories, etc.)
     */
    protected function createDemoContent(StoreWebsite $website): void
    {
        $store = $website->store;
        
        if (!$store) {
            return;
        }

        // This would integrate with your existing product/category services
        // For now, we'll create placeholder implementation
        
        $demoData = [
            'categories' => ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
            'products' => $this->generateDemoProducts(),
            'menus' => $this->generateDemoMenus($website)
        ];

        // Store demo data in website meta for future reference
        $website->update([
            'meta_data' => array_merge($website->meta_data ?? [], [
                'demo_content' => [
                    'created_at' => now()->toISOString(),
                    'content' => $demoData
                ]
            ])
        ]);
    }

    /**
     * Finalize installation
     */
    protected function finalizeInstallation(StoreWebsite $website, Theme $theme): void
    {
        // Update theme installation count
        $theme->incrementInstallations();

        // Generate header and footer for the website
        $this->generateHeaderAndFooter($website, $theme);

        // Set website as published if it wasn't
        if (!$website->is_published) {
            $website->update([
                'is_published' => true,
                'published_at' => now()
            ]);
        }

        // Clear installation status
        $this->clearInstallationStatus($website->id);

        // Cache theme configuration for faster loading
        Cache::put(
            "theme-config-{$website->id}",
            $this->generateThemeConfig($website, $theme),
            now()->addHours(24)
        );
    }

    /**
     * Generate header and footer data for the website
     */
    protected function generateHeaderAndFooter(StoreWebsite $website, Theme $theme): void
    {
        // Generate modern header
        $headerData = [
            'elements' => [
                [
                    'id' => 'header-section-' . time(),
                    'columns' => [
                        [
                            'id' => 'header-column-logo',
                            'widgets' => [
                                [
                                    'type' => 'site-logo',
                                    'content' => [
                                        'logoType' => 'text',
                                        'text' => $website->title ?? 'Your Store',
                                        'image' => $website->logo ?? null,
                                        'link' => '/'
                                    ],
                                    'settings' => [
                                        'width' => 'auto',
                                        'maxWidth' => '200px',
                                        'alignment' => 'left',
                                        'fontSize' => '24px',
                                        'fontWeight' => 'bold',
                                        'color' => '#1f2937'
                                    ],
                                    'id' => 'header-logo-' . time()
                                ]
                            ],
                            'settings' => [
                                'desktop' => [
                                    'width' => 40,
                                    'padding' => '15px 20px',
                                    'backgroundColor' => 'transparent',
                                    'alignItems' => 'center'
                                ]
                            ]
                        ],
                        [
                            'id' => 'header-column-nav',
                            'widgets' => [
                                [
                                    'type' => 'nav-menu',
                                    'content' => [
                                        'items' => [
                                            ['label' => 'Home', 'url' => '/', 'active' => true],
                                            ['label' => 'Products', 'url' => '/products'],
                                            ['label' => 'About', 'url' => '/about'],
                                            ['label' => 'Contact', 'url' => '/contact']
                                        ],
                                        'mobileBreakpoint' => 768
                                    ],
                                    'settings' => [
                                        'layout' => 'horizontal',
                                        'alignment' => 'right',
                                        'gap' => '30px',
                                        'textColor' => '#374151',
                                        'hoverColor' => '#3b82f6',
                                        'fontSize' => '16px',
                                        'fontWeight' => '500'
                                    ],
                                    'id' => 'header-nav-' . time()
                                ]
                            ],
                            'settings' => [
                                'desktop' => [
                                    'width' => 60,
                                    'padding' => '15px 20px',
                                    'backgroundColor' => 'transparent',
                                    'justifyContent' => 'flex-end',
                                    'alignItems' => 'center'
                                ]
                            ]
                        ]
                    ],
                    'settings' => [
                        'desktop' => [
                            'layout' => 'boxed',
                            'contentWidth' => '1140px',
                            'backgroundColor' => '#ffffff',
                            'padding' => '0',
                            'margin' => '0',
                            'columnsPerRow' => 2,
                            'columnGap' => '1rem',
                            'rowGap' => '1rem',
                            'alignItems' => 'center',
                            'justifyContent' => 'space-between',
                            'boxShadow' => '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        ]
                    ]
                ]
            ],
            'settings' => [
                'desktop' => [],
                'tablet' => [],
                'mobile' => []
            ],
            'updated_at' => now()->toISOString()
        ];

        // Generate modern footer
        $footerData = [
            'rows' => [
                [
                    'id' => 'footer-main-' . time(),
                    'name' => 'Main Footer',
                    'columns' => [
                        [
                            'id' => 'footer-col-about',
                            'title' => 'About Us',
                            'elements' => [
                                [
                                    'type' => 'site-logo',
                                    'content' => [
                                        'logoType' => 'text',
                                        'text' => $website->title ?? 'Your Store',
                                        'image' => $website->logo ?? null,
                                        'link' => '/'
                                    ],
                                    'settings' => [
                                        'width' => 'auto',
                                        'maxWidth' => '180px',
                                        'alignment' => 'left',
                                        'color' => '#ffffff'
                                    ],
                                    'id' => 'footer-logo-' . time()
                                ],
                                [
                                    'type' => 'text-content',
                                    'content' => [
                                        'text' => $website->description ?? 'Discover amazing products at great prices. Quality guaranteed with fast shipping and excellent customer service.'
                                    ],
                                    'settings' => [
                                        'color' => '#d1d5db',
                                        'fontSize' => '14px',
                                        'lineHeight' => '1.6',
                                        'marginTop' => '15px'
                                    ],
                                    'id' => 'footer-desc-' . time()
                                ]
                            ],
                            'alignment' => 'left'
                        ],
                        [
                            'id' => 'footer-col-links',
                            'title' => 'Quick Links',
                            'elements' => [
                                [
                                    'type' => 'footer-links',
                                    'content' => [
                                        'title' => 'Quick Links',
                                        'links' => [
                                            ['label' => 'About Us', 'url' => '/about'],
                                            ['label' => 'Products', 'url' => '/products'],
                                            ['label' => 'Contact', 'url' => '/contact'],
                                            ['label' => 'FAQ', 'url' => '/faq']
                                        ]
                                    ],
                                    'settings' => [
                                        'titleColor' => '#ffffff',
                                        'linkColor' => '#d1d5db',
                                        'hoverColor' => '#3b82f6',
                                        'titleFontSize' => '16px',
                                        'linkFontSize' => '14px'
                                    ],
                                    'id' => 'footer-links-' . time()
                                ]
                            ],
                            'alignment' => 'left'
                        ],
                        [
                            'id' => 'footer-col-newsletter',
                            'title' => 'Stay Connected',
                            'elements' => [
                                [
                                    'type' => 'newsletter',
                                    'content' => [
                                        'title' => 'Subscribe to Newsletter',
                                        'description' => 'Get the latest updates and special offers.',
                                        'placeholder' => 'Enter your email',
                                        'buttonText' => 'Subscribe'
                                    ],
                                    'settings' => [
                                        'layout' => 'vertical',
                                        'buttonColor' => '#3b82f6',
                                        'backgroundColor' => 'transparent',
                                        'titleColor' => '#ffffff',
                                        'descriptionColor' => '#d1d5db'
                                    ],
                                    'id' => 'footer-newsletter-' . time()
                                ]
                            ],
                            'alignment' => 'left'
                        ]
                    ],
                    'settings' => [
                        'layout' => 'boxed',
                        'contentWidth' => '1140px',
                        'backgroundColor' => '#1f2937',
                        'padding' => '60px 20px 40px',
                        'margin' => '0',
                        'columnsPerRow' => 3,
                        'columnGap' => '2rem',
                        'rowGap' => '2rem',
                        'alignItems' => 'flex-start'
                    ]
                ],
                [
                    'id' => 'footer-bottom-' . time(),
                    'name' => 'Copyright',
                    'columns' => [
                        [
                            'id' => 'footer-copyright',
                            'title' => 'Copyright',
                            'elements' => [
                                [
                                    'type' => 'copyright',
                                    'content' => [
                                        'text' => '© ' . date('Y') . ' ' . ($website->title ?? 'Your Store') . '. All rights reserved.',
                                        'showYear' => true,
                                        'companyName' => $website->title ?? 'Your Store'
                                    ],
                                    'settings' => [
                                        'alignment' => 'center',
                                        'textColor' => '#9ca3af',
                                        'textAlign' => 'center',
                                        'fontSize' => '14px'
                                    ],
                                    'id' => 'footer-copyright-' . time()
                                ]
                            ],
                            'alignment' => 'center'
                        ]
                    ],
                    'settings' => [
                        'layout' => 'boxed',
                        'contentWidth' => '1140px',
                        'backgroundColor' => '#111827',
                        'padding' => '20px',
                        'margin' => '0',
                        'columnsPerRow' => 1,
                        'alignItems' => 'center'
                    ]
                ]
            ],
            'settings' => [
                'desktop' => [],
                'tablet' => [],
                'mobile' => []
            ],
            'updated_at' => now()->toISOString()
        ];

        $website->update([
            'header_data' => json_encode($headerData),
            'footer_data' => json_encode($footerData)
        ]);
    }

    /**
     * Get theme pages structure from theme manifest
     */
    protected function getThemePages(Theme $theme): array
    {
        // Try to load from theme manifest first
        try {
            $manifest = $this->themeLoader->getThemeManifest($theme->slug);
            if ($manifest && isset($manifest['pages'])) {
                return $manifest['pages'];
            }
        } catch (\Exception $e) {
            Log::warning('Could not load theme manifest', [
                'theme_slug' => $theme->slug,
                'error' => $e->getMessage()
            ]);
        }

        // Fallback to default e-commerce pages
        return $this->getDefaultEcommercePages();
    }

    /**
     * Default e-commerce pages structure
     */
    protected function getDefaultEcommercePages(): array
    {
        return [
            [
                'title' => 'Home',
                'slug' => '/',
                'type' => 'homepage',
                'template' => 'home',
                'sort_order' => 0,
                'seo' => [
                    'title' => 'Welcome to Our Store',
                    'description' => 'Discover amazing products at great prices',
                    'keywords' => ['ecommerce', 'shopping', 'online store']
                ],
                'sections' => [
                    [
                        'name' => 'Hero Section',
                        'type' => 'hero',
                        'settings' => [
                            'backgroundColor' => '#f8fafc',
                            'padding' => '80px 20px',
                            'textAlign' => 'center'
                        ],
                        'components' => [
                            [
                                'type' => 'hero-banner',
                                'props' => [
                                    'title' => 'Welcome to Our Premium Store',
                                    'subtitle' => 'Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.',
                                    'buttonText' => 'Shop Now',
                                    'buttonLink' => '/products',
                                    'backgroundImage' => '/themes/modern-ecommerce/images/hero-bg.jpg',
                                    'overlayOpacity' => 0.4,
                                    'titleColor' => '#1f2937',
                                    'subtitleColor' => '#6b7280',
                                    'buttonColor' => '#3b82f6',
                                    'buttonStyle' => 'solid',
                                    'alignment' => 'center',
                                    'showSecondaryButton' => true,
                                    'secondaryButtonText' => 'Learn More',
                                    'secondaryButtonLink' => '/about',
                                    'secondaryButtonStyle' => 'outline'
                                ],
                                'styles' => [
                                    'minHeight' => '500px',
                                    'display' => 'flex',
                                    'alignItems' => 'center',
                                    'justifyContent' => 'center'
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Featured Products',
                        'type' => 'products',
                        'settings' => [
                            'backgroundColor' => '#ffffff',
                            'padding' => '60px 20px',
                            'containerMaxWidth' => '1200px'
                        ],
                        'components' => [
                            [
                                'type' => 'section-title',
                                'props' => [
                                    'title' => 'Featured Products',
                                    'subtitle' => 'Check out our most popular items',
                                    'alignment' => 'center',
                                    'titleColor' => '#1f2937',
                                    'subtitleColor' => '#6b7280',
                                    'showDivider' => true,
                                    'dividerColor' => '#e5e7eb'
                                ]
                            ],
                            [
                                'type' => 'product-grid',
                                'props' => [
                                    'limit' => 8,
                                    'featured' => true,
                                    'columns' => 4,
                                    'showQuickView' => true,
                                    'showWishlist' => true,
                                    'showCompare' => true,
                                    'showRating' => true,
                                    'showPricing' => true,
                                    'showAddToCart' => true,
                                    'imageAspectRatio' => '1:1',
                                    'cardStyle' => 'modern',
                                    'hoverEffect' => 'lift',
                                    'spacing' => 'md'
                                ],
                                'styles' => [
                                    'gap' => '24px',
                                    'marginTop' => '40px'
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Features Section',
                        'type' => 'features',
                        'settings' => [
                            'backgroundColor' => '#f9fafb',
                            'padding' => '60px 20px'
                        ],
                        'components' => [
                            [
                                'type' => 'features-grid',
                                'props' => [
                                    'features' => [
                                        [
                                            'icon' => 'truck',
                                            'title' => 'Free Shipping',
                                            'description' => 'Free shipping on orders over $99',
                                            'iconColor' => '#3b82f6'
                                        ],
                                        [
                                            'icon' => 'shield',
                                            'title' => 'Secure Payment',
                                            'description' => '100% secure payment processing',
                                            'iconColor' => '#10b981'
                                        ],
                                        [
                                            'icon' => 'refresh',
                                            'title' => 'Easy Returns',
                                            'description' => '30-day hassle-free returns',
                                            'iconColor' => '#f59e0b'
                                        ],
                                        [
                                            'icon' => 'headphones',
                                            'title' => '24/7 Support',
                                            'description' => 'Customer support round the clock',
                                            'iconColor' => '#ef4444'
                                        ]
                                    ],
                                    'columns' => 4,
                                    'iconSize' => 'lg',
                                    'textAlign' => 'center'
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Products',
                'slug' => 'products',
                'type' => 'catalog',
                'template' => 'catalog',
                'sort_order' => 1,
                'seo' => [
                    'title' => 'Our Products',
                    'description' => 'Browse our complete product catalog',
                    'keywords' => ['products', 'catalog', 'shopping']
                ],
                'sections' => [
                    [
                        'name' => 'Page Header',
                        'type' => 'header',
                        'settings' => [
                            'backgroundColor' => '#f8fafc',
                            'padding' => '40px 20px',
                            'textAlign' => 'center'
                        ],
                        'components' => [
                            [
                                'type' => 'page-banner',
                                'props' => [
                                    'title' => 'Our Products',
                                    'subtitle' => 'Browse our complete catalog of premium products',
                                    'backgroundImage' => '/themes/modern-ecommerce/images/products-banner.jpg',
                                    'overlayOpacity' => 0.3,
                                    'titleColor' => '#1f2937',
                                    'subtitleColor' => '#6b7280'
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Product Catalog',
                        'type' => 'catalog',
                        'settings' => [
                            'backgroundColor' => '#ffffff',
                            'padding' => '60px 20px'
                        ],
                        'components' => [
                            [
                                'type' => 'product-filter',
                                'props' => [
                                    'showCategoryFilter' => true,
                                    'showPriceFilter' => true,
                                    'showBrandFilter' => true,
                                    'showRatingFilter' => true,
                                    'showAvailabilityFilter' => true,
                                    'layout' => 'sidebar',
                                    'collapsible' => true,
                                    'showClearAll' => true,
                                    'priceRanges' => [
                                        ['label' => 'Under $25', 'min' => 0, 'max' => 25],
                                        ['label' => '$25 - $50', 'min' => 25, 'max' => 50],
                                        ['label' => '$50 - $100', 'min' => 50, 'max' => 100],
                                        ['label' => '$100+', 'min' => 100, 'max' => null]
                                    ]
                                ]
                            ],
                            [
                                'type' => 'product-grid',
                                'props' => [
                                    'pagination' => true,
                                    'itemsPerPage' => 12,
                                    'columns' => 3,
                                    'showSorting' => true,
                                    'showViewToggle' => true,
                                    'showQuickView' => true,
                                    'showWishlist' => true,
                                    'showCompare' => true,
                                    'showRating' => true,
                                    'showPricing' => true,
                                    'showAddToCart' => true,
                                    'imageAspectRatio' => '1:1',
                                    'cardStyle' => 'modern',
                                    'hoverEffect' => 'lift',
                                    'spacing' => 'md',
                                    'sortingOptions' => [
                                        ['label' => 'Featured', 'value' => 'featured'],
                                        ['label' => 'Price: Low to High', 'value' => 'price_asc'],
                                        ['label' => 'Price: High to Low', 'value' => 'price_desc'],
                                        ['label' => 'Newest First', 'value' => 'created_desc'],
                                        ['label' => 'Best Rating', 'value' => 'rating_desc']
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Shopping Cart',
                'slug' => 'cart',
                'type' => 'cart',
                'template' => 'cart',
                'sort_order' => 2,
                'sections' => [
                    [
                        'name' => 'Cart Contents',
                        'type' => 'cart',
                        'components' => [
                            ['type' => 'cart-table'],
                            ['type' => 'cart-summary'],
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Checkout',
                'slug' => 'checkout',
                'type' => 'checkout',
                'template' => 'checkout',
                'sort_order' => 3,
                'sections' => [
                    [
                        'name' => 'Checkout Form',
                        'type' => 'checkout',
                        'components' => [
                            ['type' => 'checkout-form'],
                            ['type' => 'order-summary'],
                        ]
                    ]
                ]
            ],
            [
                'title' => 'About Us',
                'slug' => 'about',
                'type' => 'content',
                'template' => 'page',
                'sort_order' => 4,
                'sections' => [
                    [
                        'name' => 'About Hero',
                        'type' => 'hero',
                        'settings' => [
                            'backgroundColor' => '#f8fafc',
                            'padding' => '60px 20px',
                            'textAlign' => 'center'
                        ],
                        'components' => [
                            [
                                'type' => 'page-banner',
                                'props' => [
                                    'title' => 'About Our Story',
                                    'subtitle' => 'Learn more about our journey, values, and commitment to quality',
                                    'backgroundImage' => '/themes/modern-ecommerce/images/about-banner.jpg',
                                    'overlayOpacity' => 0.3,
                                    'titleColor' => '#1f2937',
                                    'subtitleColor' => '#6b7280'
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Our Story',
                        'type' => 'content',
                        'settings' => [
                            'backgroundColor' => '#ffffff',
                            'padding' => '60px 20px'
                        ],
                        'components' => [
                            [
                                'type' => 'text-with-image',
                                'props' => [
                                    'title' => 'Our Journey Began in 2020',
                                    'content' => 'What started as a small passion project has grown into a trusted destination for quality products. We believe in delivering exceptional value while maintaining the highest standards of customer service. Our team is dedicated to curating the best products and ensuring every customer has an amazing shopping experience.',
                                    'image' => '/themes/modern-ecommerce/images/our-story.jpg',
                                    'imagePosition' => 'right',
                                    'imageAlt' => 'Our team at work',
                                    'titleColor' => '#1f2937',
                                    'textColor' => '#4b5563',
                                    'alignment' => 'left'
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Our Values',
                        'type' => 'features',
                        'settings' => [
                            'backgroundColor' => '#f9fafb',
                            'padding' => '60px 20px'
                        ],
                        'components' => [
                            [
                                'type' => 'section-title',
                                'props' => [
                                    'title' => 'Our Core Values',
                                    'subtitle' => 'The principles that guide everything we do',
                                    'alignment' => 'center',
                                    'titleColor' => '#1f2937',
                                    'subtitleColor' => '#6b7280'
                                ]
                            ],
                            [
                                'type' => 'values-grid',
                                'props' => [
                                    'values' => [
                                        [
                                            'icon' => 'star',
                                            'title' => 'Quality First',
                                            'description' => 'We never compromise on the quality of our products and services.',
                                            'iconColor' => '#3b82f6'
                                        ],
                                        [
                                            'icon' => 'heart',
                                            'title' => 'Customer Focused',
                                            'description' => 'Every decision we make puts our customers at the center.',
                                            'iconColor' => '#ef4444'
                                        ],
                                        [
                                            'icon' => 'leaf',
                                            'title' => 'Sustainability',
                                            'description' => 'We are committed to environmentally responsible practices.',
                                            'iconColor' => '#10b981'
                                        ]
                                    ],
                                    'columns' => 3,
                                    'iconSize' => 'lg',
                                    'textAlign' => 'center'
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Team Section',
                        'type' => 'team',
                        'settings' => [
                            'backgroundColor' => '#ffffff',
                            'padding' => '60px 20px'
                        ],
                        'components' => [
                            [
                                'type' => 'section-title',
                                'props' => [
                                    'title' => 'Meet Our Team',
                                    'subtitle' => 'The passionate people behind our success',
                                    'alignment' => 'center',
                                    'titleColor' => '#1f2937',
                                    'subtitleColor' => '#6b7280'
                                ]
                            ],
                            [
                                'type' => 'team-grid',
                                'props' => [
                                    'team' => [
                                        [
                                            'name' => 'Sarah Johnson',
                                            'position' => 'Founder & CEO',
                                            'image' => '/themes/modern-ecommerce/images/team-1.jpg',
                                            'bio' => 'Sarah founded our company with a vision to make quality products accessible to everyone.',
                                            'social' => [
                                                ['platform' => 'linkedin', 'url' => '#'],
                                                ['platform' => 'twitter', 'url' => '#']
                                            ]
                                        ],
                                        [
                                            'name' => 'Michael Chen',
                                            'position' => 'Head of Operations',
                                            'image' => '/themes/modern-ecommerce/images/team-2.jpg',
                                            'bio' => 'Michael ensures our operations run smoothly and efficiently.',
                                            'social' => [
                                                ['platform' => 'linkedin', 'url' => '#']
                                            ]
                                        ],
                                        [
                                            'name' => 'Emily Rodriguez',
                                            'position' => 'Customer Success Manager',
                                            'image' => '/themes/modern-ecommerce/images/team-3.jpg',
                                            'bio' => 'Emily leads our customer success initiatives and support.',
                                            'social' => [
                                                ['platform' => 'linkedin', 'url' => '#'],
                                                ['platform' => 'twitter', 'url' => '#']
                                            ]
                                        ]
                                    ],
                                    'columns' => 3,
                                    'showBio' => true,
                                    'showSocial' => true,
                                    'cardStyle' => 'modern'
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            [
                'title' => 'Contact',
                'slug' => 'contact',
                'type' => 'contact',
                'template' => 'page',
                'sort_order' => 5,
                'sections' => [
                    [
                        'name' => 'Contact Hero',
                        'type' => 'hero',
                        'settings' => [
                            'backgroundColor' => '#f8fafc',
                            'padding' => '60px 20px',
                            'textAlign' => 'center'
                        ],
                        'components' => [
                            [
                                'type' => 'page-banner',
                                'props' => [
                                    'title' => 'Get in Touch',
                                    'subtitle' => 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
                                    'backgroundImage' => '/themes/modern-ecommerce/images/contact-banner.jpg',
                                    'overlayOpacity' => 0.3,
                                    'titleColor' => '#1f2937',
                                    'subtitleColor' => '#6b7280'
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Contact Content',
                        'type' => 'contact',
                        'settings' => [
                            'backgroundColor' => '#ffffff',
                            'padding' => '60px 20px'
                        ],
                        'components' => [
                            [
                                'type' => 'contact-info',
                                'props' => [
                                    'contacts' => [
                                        [
                                            'icon' => 'phone',
                                            'title' => 'Phone',
                                            'value' => '+1 (555) 123-4567',
                                            'description' => 'Mon-Fri from 8am to 6pm',
                                            'link' => 'tel:+15551234567'
                                        ],
                                        [
                                            'icon' => 'mail',
                                            'title' => 'Email',
                                            'value' => 'hello@example.com',
                                            'description' => 'We\'ll respond within 24 hours',
                                            'link' => 'mailto:hello@example.com'
                                        ],
                                        [
                                            'icon' => 'map-pin',
                                            'title' => 'Address',
                                            'value' => '123 Business Street, Suite 100',
                                            'description' => 'City, State 12345',
                                            'link' => 'https://maps.google.com/?q=123+Business+Street'
                                        ]
                                    ],
                                    'layout' => 'grid',
                                    'columns' => 3,
                                    'iconColor' => '#3b82f6',
                                    'showIcons' => true
                                ]
                            ],
                            [
                                'type' => 'contact-form',
                                'props' => [
                                    'title' => 'Send us a Message',
                                    'fields' => [
                                        ['name' => 'name', 'label' => 'Full Name', 'type' => 'text', 'required' => true],
                                        ['name' => 'email', 'label' => 'Email Address', 'type' => 'email', 'required' => true],
                                        ['name' => 'phone', 'label' => 'Phone Number', 'type' => 'tel', 'required' => false],
                                        ['name' => 'subject', 'label' => 'Subject', 'type' => 'text', 'required' => true],
                                        ['name' => 'message', 'label' => 'Message', 'type' => 'textarea', 'required' => true, 'rows' => 5]
                                    ],
                                    'submitText' => 'Send Message',
                                    'successMessage' => 'Thank you for your message! We\'ll get back to you soon.',
                                    'layout' => '2-column',
                                    'buttonColor' => '#3b82f6',
                                    'buttonStyle' => 'solid'
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Location Map',
                        'type' => 'map',
                        'settings' => [
                            'backgroundColor' => '#f9fafb',
                            'padding' => '0'
                        ],
                        'components' => [
                            [
                                'type' => 'map-embed',
                                'props' => [
                                    'address' => '123 Business Street, Suite 100, City, State 12345',
                                    'height' => '400px',
                                    'zoom' => 15,
                                    'showMarker' => true,
                                    'markerTitle' => 'Our Office',
                                    'mapType' => 'roadmap',
                                    'style' => 'default'
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];
    }

    /**
     * Generate demo products
     */
    protected function generateDemoProducts(): array
    {
        return [
            [
                'name' => 'Wireless Headphones',
                'description' => 'High-quality wireless headphones with noise cancellation',
                'price' => 199.99,
                'category' => 'Electronics'
            ],
            [
                'name' => 'Cotton T-Shirt',
                'description' => 'Comfortable 100% cotton t-shirt in various colors',
                'price' => 29.99,
                'category' => 'Clothing'
            ],
            // Add more demo products...
        ];
    }

    /**
     * Generate demo menus
     */
    protected function generateDemoMenus(StoreWebsite $website): array
    {
        return [
            [
                'name' => 'Main Navigation',
                'location' => 'header',
                'items' => [
                    ['title' => 'Home', 'url' => '/'],
                    ['title' => 'Products', 'url' => '/products'],
                    ['title' => 'About', 'url' => '/about'],
                    ['title' => 'Contact', 'url' => '/contact']
                ]
            ]
        ];
    }

    /**
     * Generate theme configuration for caching
     */
    protected function generateThemeConfig(StoreWebsite $website, Theme $theme): array
    {
        return [
            'theme' => [
                'id' => $theme->id,
                'slug' => $theme->slug,
                'name' => $theme->name,
                'version' => $theme->version
            ],
            'customization' => $website->themeCustomization?->toArray(),
            'global_styles' => $website->global_styles,
            'header_data' => $website->header_data,
            'footer_data' => $website->footer_data
        ];
    }

    /**
     * Installation status management
     */
    protected function setInstallationStatus(int $websiteId, string $status, int $progress, array $errors = []): void
    {
        Cache::put("theme_installation_{$websiteId}", [
            'status' => $status,
            'progress' => $progress,
            'current_step' => $status,
            'errors' => $errors,
            'started_at' => now()->toISOString(),
            'updated_at' => now()->toISOString()
        ], now()->addHours(2));
    }

    protected function updateInstallationProgress(int $websiteId, string $step, int $progress): void
    {
        $status = Cache::get("theme_installation_{$websiteId}", []);
        $status['current_step'] = $step;
        $status['progress'] = $progress;
        $status['updated_at'] = now()->toISOString();
        
        Cache::put("theme_installation_{$websiteId}", $status, now()->addHours(2));
    }

    protected function clearInstallationStatus(int $websiteId): void
    {
        Cache::forget("theme_installation_{$websiteId}");
    }

    /**
     * Get installation status
     */
    public function getInstallationStatus(int $websiteId): array
    {
        return Cache::get("theme_installation_{$websiteId}", [
            'status' => 'not_found',
            'progress' => 0,
            'current_step' => '',
            'errors' => []
        ]);
    }

    /**
     * Mark installation as failed (for job failure handling)
     */
    public function markInstallationAsFailed(int $websiteId, string $errorMessage): void
    {
        $this->setInstallationStatus($websiteId, 'failed', 0, [$errorMessage]);
    }
}