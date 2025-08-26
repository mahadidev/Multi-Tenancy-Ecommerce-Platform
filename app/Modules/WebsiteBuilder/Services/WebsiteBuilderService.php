<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsitePage;
use App\Modules\WebsiteBuilder\Models\WebsiteTemplate;
use App\Modules\WebsiteBuilder\Models\ComponentType;
use App\Modules\WebsiteBuilder\Models\PageSection;
use App\Modules\WebsiteBuilder\Models\SectionComponent;
use Illuminate\Support\Facades\DB;

class WebsiteBuilderService
{
    /**
     * Apply a theme to a store website
     */
    public function applyThemeToWebsite(int $storeId, WebsiteTemplate $theme, bool $customizeColors = false, array $colors = []): array
    {
        DB::beginTransaction();
        try {
            // Find or create website for store
            $website = StoreWebsite::firstOrCreate(
                ['store_id' => $storeId],
                [
                    'title' => 'My Store',
                    'subdomain' => $this->generateSubdomain($storeId),
                    'is_published' => false
                ]
            );

            // Update website with theme
            $themeConfig = $theme->config;
            if ($customizeColors && !empty($colors)) {
                $themeConfig['colors'] = array_merge($themeConfig['colors'] ?? [], $colors);
            }

            $website->update([
                'template_id' => $theme->id,
                'title' => $website->title ?: $theme->name . ' Store',
                'global_styles' => $themeConfig
            ]);

            // Clear existing pages if applying new theme
            if ($website->wasChanged('template_id')) {
                $website->pages()->delete();
            }

            // Create default pages from theme
            $this->createDefaultPages($website, $theme);

            DB::commit();

            return [
                'website' => $website->load(['pages', 'template']),
                'theme' => $theme,
                'message' => 'Theme applied successfully'
            ];

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Create default pages from theme configuration
     */
    private function createDefaultPages(StoreWebsite $website, WebsiteTemplate $theme): void
    {
        $defaultPages = $theme->default_pages ?? [];

        foreach ($defaultPages as $pageConfig) {
            $page = WebsitePage::create([
                'website_id' => $website->id,
                'title' => $pageConfig['title'],
                'slug' => $pageConfig['slug'],
                'description' => $pageConfig['description'] ?? null,
                'is_homepage' => $pageConfig['is_homepage'] ?? false,
                'is_published' => true,
                'sort_order' => $pageConfig['sort_order'] ?? 0
            ]);

            // Create sections for this page
            $this->createPageSections($page, $pageConfig['sections'] ?? []);
        }
    }

    /**
     * Create page sections from configuration
     */
    private function createPageSections(WebsitePage $page, array $sectionsConfig): void
    {
        foreach ($sectionsConfig as $sectionConfig) {
            $componentType = ComponentType::where('type', $sectionConfig['type'])->first();
            
            if (!$componentType) {
                continue; // Skip if component type doesn't exist
            }

            $section = PageSection::create([
                'page_id' => $page->id,
                'name' => $componentType->name,
                'type' => $componentType->category,
                'settings' => $sectionConfig['props'] ?? [],
                'sort_order' => $sectionConfig['order'] ?? 0,
                'is_visible' => true
            ]);

            // Create the component within the section
            SectionComponent::create([
                'section_id' => $section->id,
                'component_type_id' => $componentType->id,
                'props' => array_merge(
                    $componentType->default_props ?? [],
                    $sectionConfig['props'] ?? []
                ),
                'sort_order' => 0,
                'is_visible' => true
            ]);
        }
    }

    /**
     * Generate a unique subdomain for the store
     */
    private function generateSubdomain(int $storeId): string
    {
        // Try to get store slug first
        $store = \App\Models\Store::find($storeId);
        $baseSubdomain = $store->slug ?? "store-{$storeId}";
        
        // Ensure uniqueness
        $subdomain = $baseSubdomain;
        $counter = 1;
        
        while (StoreWebsite::where('subdomain', $subdomain)->exists()) {
            $subdomain = $baseSubdomain . '-' . $counter;
            $counter++;
        }
        
        return $subdomain;
    }

    /**
     * Clone a website page
     */
    public function clonePage(WebsitePage $originalPage, string $newTitle, string $newSlug): WebsitePage
    {
        DB::beginTransaction();
        try {
            $newPage = WebsitePage::create([
                'website_id' => $originalPage->website_id,
                'title' => $newTitle,
                'slug' => $newSlug,
                'description' => $originalPage->description,
                'seo_meta' => $originalPage->seo_meta,
                'page_settings' => $originalPage->page_settings,
                'is_homepage' => false,
                'is_published' => false,
                'sort_order' => WebsitePage::where('website_id', $originalPage->website_id)->max('sort_order') + 1
            ]);

            // Clone sections
            foreach ($originalPage->sections as $section) {
                $newSection = PageSection::create([
                    'page_id' => $newPage->id,
                    'name' => $section->name,
                    'type' => $section->type,
                    'settings' => $section->settings,
                    'styles' => $section->styles,
                    'sort_order' => $section->sort_order,
                    'is_visible' => $section->is_visible
                ]);

                // Clone components
                foreach ($section->components as $component) {
                    SectionComponent::create([
                        'section_id' => $newSection->id,
                        'component_type_id' => $component->component_type_id,
                        'props' => $component->props,
                        'styles' => $component->styles,
                        'sort_order' => $component->sort_order,
                        'is_visible' => $component->is_visible
                    ]);
                }
            }

            DB::commit();
            return $newPage->load(['sections.components.componentType']);

        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Generate website preview data
     */
    public function generatePreviewData(StoreWebsite $website): array
    {
        $pages = $website->pages()->with(['sections.components.componentType'])->get();
        
        $previewData = [
            'website' => [
                'id' => $website->id,
                'title' => $website->title,
                'description' => $website->description,
                'subdomain' => $website->subdomain,
                'global_styles' => $website->global_styles,
                'theme' => $website->template->name ?? 'Default'
            ],
            'pages' => []
        ];

        foreach ($pages as $page) {
            $pageData = [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'is_homepage' => $page->is_homepage,
                'sections' => []
            ];

            foreach ($page->sections as $section) {
                $sectionData = [
                    'id' => $section->id,
                    'type' => $section->type,
                    'name' => $section->name,
                    'settings' => $section->settings,
                    'sort_order' => $section->sort_order,
                    'is_visible' => $section->is_visible,
                    'components' => []
                ];

                foreach ($section->components as $component) {
                    $sectionData['components'][] = [
                        'id' => $component->id,
                        'type' => $component->componentType->type,
                        'name' => $component->componentType->name,
                        'props' => $component->props,
                        'default_props' => $component->componentType->default_props,
                        'sort_order' => $component->sort_order,
                        'is_visible' => $component->is_visible
                    ];
                }

                $pageData['sections'][] = $sectionData;
            }

            $previewData['pages'][] = $pageData;
        }

        return $previewData;
    }

    /**
     * Publish website
     */
    public function publishWebsite(StoreWebsite $website): void
    {
        $website->update([
            'is_published' => true,
            'published_at' => now()
        ]);

        // Ensure at least one page is marked as homepage
        if (!$website->pages()->where('is_homepage', true)->exists()) {
            $firstPage = $website->pages()->first();
            if ($firstPage) {
                $firstPage->update(['is_homepage' => true]);
            }
        }
    }

    /**
     * Get component categories with counts
     */
    public function getComponentCategories(): array
    {
        $components = ComponentType::where('is_active', true)->get();
        
        $categories = $components->groupBy('category')->map(function ($components, $category) {
            return [
                'name' => $category,
                'count' => $components->count(),
                'components' => $components->toArray()
            ];
        });

        return $categories->toArray();
    }

    /**
     * Search components
     */
    public function searchComponents(string $query, ?string $category = null): array
    {
        $queryBuilder = ComponentType::where('is_active', true)
            ->where(function($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%")
                  ->orWhere('type', 'LIKE', "%{$query}%");
            });

        if ($category && $category !== 'all') {
            $queryBuilder->where('category', $category);
        }

        return $queryBuilder->orderBy('name')->get()->toArray();
    }

    /**
     * Get theme preview data
     */
    public function getThemePreview(WebsiteTemplate $theme): array
    {
        return [
            'theme' => $theme->toArray(),
            'pages' => $theme->default_pages ?? [],
            'config' => $theme->config ?? [],
            'preview_url' => $theme->preview_url
        ];
    }

    /**
     * Validate component props against schema
     */
    public function validateComponentProps(ComponentType $componentType, array $props): array
    {
        $schema = $componentType->prop_schema ?? [];
        $defaultProps = $componentType->default_props ?? [];
        
        // Merge with defaults
        $validatedProps = array_merge($defaultProps, $props);
        
        // Basic validation based on schema
        if (isset($schema['properties'])) {
            foreach ($schema['properties'] as $propName => $propSchema) {
                if (isset($validatedProps[$propName])) {
                    $value = $validatedProps[$propName];
                    
                    // Type validation
                    if (isset($propSchema['type'])) {
                        switch ($propSchema['type']) {
                            case 'string':
                                $validatedProps[$propName] = (string) $value;
                                break;
                            case 'number':
                                $validatedProps[$propName] = is_numeric($value) ? (float) $value : 0;
                                break;
                            case 'boolean':
                                $validatedProps[$propName] = (bool) $value;
                                break;
                        }
                    }
                    
                    // Enum validation
                    if (isset($propSchema['enum']) && !in_array($value, $propSchema['enum'])) {
                        $validatedProps[$propName] = $propSchema['enum'][0] ?? $defaultProps[$propName] ?? null;
                    }
                }
            }
        }
        
        return $validatedProps;
    }
}