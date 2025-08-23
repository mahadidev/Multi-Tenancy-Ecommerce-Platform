<?php

namespace App\Modules\WebsiteBuilder\Services;

use App\Modules\WebsiteBuilder\Models\WebsitePage;
use App\Modules\WebsiteBuilder\Models\PageSection;
use App\Modules\WebsiteBuilder\Models\PageComponent;
use Illuminate\Support\Facades\Cache;

class WebsiteRenderService
{
    protected $dataIntegrationService;

    public function __construct(DataIntegrationService $dataIntegrationService)
    {
        $this->dataIntegrationService = $dataIntegrationService;
    }

    /**
     * Render a complete page with all its sections and components
     */
    public function renderPage(WebsitePage $page): array
    {
        $cacheKey = "rendered_page_{$page->id}_" . $page->updated_at->timestamp;
        
        return Cache::remember($cacheKey, 600, function () use ($page) {
            $sections = $page->sections()
                ->visible()
                ->with(['components.componentType'])
                ->ordered()
                ->get();

            $renderedSections = [];

            foreach ($sections as $section) {
                $renderedSections[] = $this->renderSection($section);
            }

            return [
                'id' => $page->id,
                'title' => $page->title,
                'slug' => $page->slug,
                'description' => $page->description,
                'type' => $page->type,
                'seo_meta' => $page->seo_meta,
                'is_homepage' => $page->is_homepage,
                'sections' => $renderedSections,
                'meta_data' => $page->meta_data,
            ];
        });
    }

    /**
     * Render a section with all its components
     */
    public function renderSection(PageSection $section): array
    {
        $components = $section->components()
            ->visible()
            ->with('componentType')
            ->ordered()
            ->get();

        $renderedComponents = [];

        foreach ($components as $component) {
            $renderedComponents[] = $this->renderComponent($component);
        }

        return [
            'id' => $section->id,
            'name' => $section->name,
            'type' => $section->type,
            'container_styles' => $section->container_styles,
            'responsive_settings' => $section->responsive_settings,
            'components' => $renderedComponents,
            'meta_data' => $section->meta_data,
        ];
    }

    /**
     * Render an individual component with dynamic data
     */
    public function renderComponent(PageComponent $component): array
    {
        $componentType = $component->componentType;
        $props = $component->merged_props;
        $styles = $component->merged_styles;

        // Get dynamic data for e-commerce components
        $dynamicData = [];
        $store = $component->section->page->website->store;

        if ($this->isEcommerceComponent($componentType->slug)) {
            $dynamicData = $this->dataIntegrationService->renderDynamicContent(
                $store,
                $componentType->slug,
                $props
            );
        }

        // Merge static props with dynamic data
        $finalProps = array_merge($props, $dynamicData);

        // Process template with props
        $renderedTemplate = $this->processTemplate($componentType->template, $finalProps);

        return [
            'id' => $component->id,
            'name' => $component->name,
            'type' => $componentType->slug,
            'category' => $componentType->category->slug ?? 'unknown',
            'component_type' => [
                'id' => $componentType->id,
                'name' => $componentType->name,
                'slug' => $componentType->slug,
                'description' => $componentType->description,
                'category' => $componentType->category ? [
                    'id' => $componentType->category->id,
                    'name' => $componentType->category->name,
                    'slug' => $componentType->category->slug,
                ] : null,
            ],
            'props' => $finalProps,
            'styles' => $styles,
            'template' => $renderedTemplate,
            'responsive_settings' => $component->responsive_settings,
            'animation_settings' => $component->animation_settings,
            'meta_data' => $component->meta_data,
            'sort_order' => $component->sort_order,
            'is_visible' => $component->is_visible,
        ];
    }

    /**
     * Process template string with props using simple template engine
     */
    private function processTemplate(?string $template, array $props): string
    {
        if (!$template) {
            return '';
        }

        // Simple template processing - replace {{variable}} with values
        $processed = $template;

        // Handle simple variable replacement
        foreach ($props as $key => $value) {
            if (is_string($value) || is_numeric($value)) {
                $processed = str_replace("{{$key}}", $value, $processed);
            }
        }

        // Handle conditional blocks {{#if condition}}...{{/if}}
        $processed = $this->processConditionals($processed, $props);

        // Handle loops {{#each array}}...{{/each}}
        $processed = $this->processLoops($processed, $props);

        return $processed;
    }

    /**
     * Process conditional blocks in template
     */
    private function processConditionals(string $template, array $props): string
    {
        // Simple conditional processing
        $pattern = '/\{\{#if\s+(\w+)\}\}(.*?)\{\{\/if\}\}/s';
        
        return preg_replace_callback($pattern, function ($matches) use ($props) {
            $condition = $matches[1];
            $content = $matches[2];
            
            if (isset($props[$condition]) && $props[$condition]) {
                return $content;
            }
            
            return '';
        }, $template);
    }

    /**
     * Process loop blocks in template
     */
    private function processLoops(string $template, array $props): string
    {
        // Simple loop processing
        $pattern = '/\{\{#each\s+(\w+)\}\}(.*?)\{\{\/each\}\}/s';
        
        return preg_replace_callback($pattern, function ($matches) use ($props) {
            $arrayName = $matches[1];
            $itemTemplate = $matches[2];
            
            if (!isset($props[$arrayName]) || !is_array($props[$arrayName])) {
                return '';
            }
            
            $result = '';
            foreach ($props[$arrayName] as $item) {
                $itemRendered = $itemTemplate;
                
                // Replace item properties
                if (is_array($item)) {
                    foreach ($item as $key => $value) {
                        if (is_string($value) || is_numeric($value)) {
                            $itemRendered = str_replace("{{$key}}", $value, $itemRendered);
                        }
                    }
                }
                
                $result .= $itemRendered;
            }
            
            return $result;
        }, $template);
    }

    /**
     * Check if component type requires dynamic e-commerce data
     */
    private function isEcommerceComponent(string $componentSlug): bool
    {
        $ecommerceComponents = [
            'product-grid',
            'category-list',
            'brand-showcase',
            'store-stats',
            'testimonials', // Uses order data
            'store-info',
        ];

        return in_array($componentSlug, $ecommerceComponents);
    }

    /**
     * Generate CSS from styles array
     */
    public function generateCSS(array $styles): string
    {
        if (empty($styles)) {
            return '';
        }

        $css = '';

        foreach ($styles as $selector => $properties) {
            if (is_array($properties)) {
                $css .= $selector . " {\n";
                
                foreach ($properties as $property => $value) {
                    $css .= "  {$property}: {$value};\n";
                }
                
                $css .= "}\n\n";
            }
        }

        return $css;
    }

    /**
     * Render component preview for admin/editor
     */
    public function renderComponentPreview(PageComponent $component): array
    {
        // Similar to renderComponent but without full dynamic data
        // Used for fast preview in the editor
        $componentType = $component->componentType;
        $props = $component->merged_props;

        // Use sample data for preview
        $sampleData = $this->getSampleDataForComponent($componentType->slug);
        $finalProps = array_merge($props, $sampleData);

        $renderedTemplate = $this->processTemplate($componentType->template, $finalProps);

        return [
            'id' => $component->id,
            'type' => $componentType->slug,
            'props' => $finalProps,
            'template' => $renderedTemplate,
            'styles' => $component->merged_styles,
        ];
    }

    /**
     * Get sample data for component preview
     */
    private function getSampleDataForComponent(string $componentSlug): array
    {
        $sampleData = [
            'product-grid' => [
                'products' => [
                    [
                        'id' => 1,
                        'name' => 'Sample Product 1',
                        'price' => 99.99,
                        'thumbnail' => '/images/sample-product.jpg',
                        'url' => '/products/sample-product-1',
                    ],
                    [
                        'id' => 2,
                        'name' => 'Sample Product 2',
                        'price' => 149.99,
                        'thumbnail' => '/images/sample-product.jpg',
                        'url' => '/products/sample-product-2',
                    ],
                ],
            ],
            'category-list' => [
                'categories' => [
                    [
                        'id' => 1,
                        'name' => 'Electronics',
                        'products_count' => 25,
                        'url' => '/categories/electronics',
                    ],
                    [
                        'id' => 2,
                        'name' => 'Clothing',
                        'products_count' => 50,
                        'url' => '/categories/clothing',
                    ],
                ],
            ],
            'testimonials' => [
                'testimonials' => [
                    [
                        'quote' => 'Amazing products and excellent service!',
                        'author' => 'John Doe',
                        'position' => 'Verified Customer',
                    ],
                    [
                        'quote' => 'Fast shipping and great quality.',
                        'author' => 'Jane Smith',
                        'position' => 'Happy Customer',
                    ],
                ],
            ],
        ];

        return $sampleData[$componentSlug] ?? [];
    }

    /**
     * Clear render cache for a page
     */
    public function clearPageCache(WebsitePage $page): void
    {
        $pattern = "rendered_page_{$page->id}_*";
        // In a real implementation, you'd use a more sophisticated cache clearing mechanism
        Cache::forget($pattern);
    }
}