<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsiteTemplate;
use App\Modules\WebsiteBuilder\Requests\CreateStoreWebsiteRequest;
use App\Modules\WebsiteBuilder\Requests\UpdateStoreWebsiteRequest;
use App\Modules\WebsiteBuilder\Services\WebsiteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreWebsiteController extends Controller
{
    protected $websiteService;

    public function __construct(WebsiteService $websiteService)
    {
        $this->websiteService = $websiteService;
    }

    public function index(Request $request): JsonResponse
    {
        $storeId = $this->getCurrentStoreId();
        
        $websites = StoreWebsite::where('store_id', $storeId)
            ->with(['template', 'pages'])
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Websites retrieved successfully',
            'data' => $websites
        ]);
    }

    public function show($id): JsonResponse
    {
        $storeId = authStore();
        
        $website = StoreWebsite::byStore($storeId)
            ->with(['template', 'pages.sections.components.componentType', 'menus', 'forms'])
            ->findOrFail($id);

        return response()->json([
            'status' => 200,
            'message' => 'Website retrieved successfully',
            'data' => $website
        ]);
    }

    public function store(CreateStoreWebsiteRequest $request): JsonResponse
    {
        try {
            $storeId = authStore();
            $data = array_merge($request->validated(), ['store_id' => $storeId]);
            
            $website = $this->websiteService->createWebsite($data);

            return response()->json([
                'status' => 201,
                'message' => 'Website created successfully',
                'data' => $website
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to create website: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateStoreWebsiteRequest $request, $id): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($id);
            $website = $this->websiteService->updateWebsite($website, $request->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Website updated successfully',
                'data' => $website
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update website: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($id);
            $website->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Website deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to delete website: ' . $e->getMessage()
            ], 500);
        }
    }

    public function publish($id): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($id);
            
            $website->update([
                'is_published' => true,
                'published_at' => now()
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Website published successfully',
                'data' => $website
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to publish website: ' . $e->getMessage()
            ], 500);
        }
    }

    public function unpublish($id): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($id);
            
            $website->update(['is_published' => false]);

            return response()->json([
                'status' => 200,
                'message' => 'Website unpublished successfully',
                'data' => $website
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to unpublish website: ' . $e->getMessage()
            ], 500);
        }
    }

    public function duplicate($id): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($id);
            $duplicateWebsite = $this->websiteService->duplicateWebsite($website);

            return response()->json([
                'status' => 201,
                'message' => 'Website duplicated successfully',
                'data' => $duplicateWebsite
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to duplicate website: ' . $e->getMessage()
            ], 500);
        }
    }

    public function createFromTemplate(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'template_id' => 'required|exists:website_templates,id',
                'title' => 'required|string|max:255',
                'subdomain' => 'required|string|max:255|unique:store_websites,subdomain',
            ]);

            $storeId = authStore();
            $template = WebsiteTemplate::findOrFail($request->template_id);
            
            $website = $this->websiteService->createWebsiteFromTemplate($template, [
                'store_id' => $storeId,
                'title' => $request->title,
                'subdomain' => $request->subdomain,
            ]);

            return response()->json([
                'status' => 201,
                'message' => 'Website created from template successfully',
                'data' => $website
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to create website from template: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getHeader($websiteId): JsonResponse
    {
        try {
            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);

            $headerData = $website->header_data ? json_decode($website->header_data, true) : [
                'columns' => [
                    [
                        'id' => 'column-1',
                        'elements' => [],
                        'alignment' => 'left',
                        'justifyContent' => 'start',
                        'alignItems' => 'center',
                        'flexDirection' => 'row',
                        'gap' => 'md'
                    ],
                    [
                        'id' => 'column-2',
                        'elements' => [],
                        'alignment' => 'center',
                        'justifyContent' => 'center',
                        'alignItems' => 'center',
                        'flexDirection' => 'row',
                        'gap' => 'md'
                    ],
                    [
                        'id' => 'column-3',
                        'elements' => [],
                        'alignment' => 'right',
                        'justifyContent' => 'end',
                        'alignItems' => 'center',
                        'flexDirection' => 'row',
                        'gap' => 'md'
                    ]
                ],
                'settings' => [
                    'layout' => 'grid',
                    'columnCount' => 3,
                    'sticky' => true,
                    'backgroundColor' => '#ffffff',
                    'textColor' => '#000000',
                    'height' => 'auto',
                    'padding' => '1rem',
                    'shadow' => true,
                    'maxWidth' => 'container',
                ]
            ];

            return response()->json([
                'status' => 200,
                'data' => $headerData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to get header data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateHeader($websiteId, Request $request): JsonResponse
    {
        try {
            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);

            // Handle both old format (elements) and new format (columns)
            $validation = $request->validate([
                'settings' => 'required|array',
            ]);

            // Check for either columns (new format) or elements (old format)
            if ($request->has('columns')) {
                $request->validate(['columns' => 'array']);
                $headerData = json_encode([
                    'columns' => $request->columns ?? [],
                    'settings' => $request->settings,
                    'updated_at' => now()->toISOString()
                ]);
            } else {
                $request->validate(['elements' => 'array']);
                $headerData = json_encode([
                    'elements' => $request->elements ?? [],
                    'settings' => $request->settings,
                    'updated_at' => now()->toISOString()
                ]);
            }

            $website->update(['header_data' => $headerData]);

            return response()->json([
                'status' => 200,
                'message' => 'Header updated successfully',
                'data' => json_decode($headerData, true)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update header: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getFooter($websiteId): JsonResponse
    {
        try {
            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);

            $footerData = $website->footer_data ? json_decode($website->footer_data, true) : [
                'columns' => [
                    [
                        'id' => 'col-1',
                        'title' => 'Column 1',
                        'elements' => [],
                        'alignment' => 'left',
                        'justifyContent' => 'start',
                        'alignItems' => 'start',
                        'flexDirection' => 'column',
                        'gap' => 'md'
                    ],
                    [
                        'id' => 'col-2',
                        'title' => 'Column 2',
                        'elements' => [],
                        'alignment' => 'left',
                        'justifyContent' => 'start',
                        'alignItems' => 'start',
                        'flexDirection' => 'column',
                        'gap' => 'md'
                    ],
                    [
                        'id' => 'col-3',
                        'title' => 'Column 3',
                        'elements' => [],
                        'alignment' => 'left',
                        'justifyContent' => 'start',
                        'alignItems' => 'start',
                        'flexDirection' => 'column',
                        'gap' => 'md'
                    ],
                    [
                        'id' => 'col-4',
                        'title' => 'Column 4',
                        'elements' => [],
                        'alignment' => 'left',
                        'justifyContent' => 'start',
                        'alignItems' => 'start',
                        'flexDirection' => 'column',
                        'gap' => 'md'
                    ]
                ],
                'settings' => [
                    'columns' => 4,
                    'backgroundColor' => '#1f2937',
                    'textColor' => '#ffffff',
                    'linkColor' => '#60a5fa',
                    'padding' => '3rem 1rem',
                    'borderTop' => true,
                    'borderColor' => '#374151',
                ]
            ];

            return response()->json([
                'status' => 200,
                'data' => $footerData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to get footer data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateFooter($websiteId, Request $request): JsonResponse
    {
        try {
            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);

            $request->validate([
                'columns' => 'array',
                'rows' => 'array',
                'settings' => 'required|array',
            ]);

            // Support both old columns format and new rows format
            if ($request->has('rows')) {
                // New multi-row format
                $footerData = json_encode([
                    'rows' => $request->rows ?? [],
                    'settings' => $request->settings,
                    'updated_at' => now()->toISOString()
                ]);
            } else {
                // Legacy single-row columns format
                $footerData = json_encode([
                    'columns' => $request->columns ?? [],
                    'settings' => $request->settings,
                    'updated_at' => now()->toISOString()
                ]);
            }

            $website->update(['footer_data' => $footerData]);

            return response()->json([
                'status' => 200,
                'message' => 'Footer updated successfully',
                'data' => json_decode($footerData, true)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update footer: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single page by ID for current store
     */
    public function getPage(Request $request, $pageId): JsonResponse
    {
        try {
            $storeId = $this->getCurrentStoreId();
            
            // Get the store's website (should be only one)
            $website = StoreWebsite::where('store_id', $storeId)->first();
            
            if (!$website) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No website found for this store'
                ], 404);
            }
            
            // Get specific page with sections and components
            $page = \App\Modules\WebsiteBuilder\Models\WebsitePage::where('website_id', $website->id)
                ->where('id', $pageId)
                ->with(['sections.components.componentType'])
                ->first();
                
            if (!$page) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Page not found'
                ], 404);
            }

            // Transform sections and components for the page builder
            $sections = $page->sections->map(function ($section) {
                return [
                    'id' => $section->id,
                    'name' => $section->name,
                    'type' => $section->type,
                    'sort_order' => $section->sort_order,
                    'is_visible' => $section->is_visible,
                    'components' => $section->components->map(function ($component) {
                        return [
                            'id' => $component->id,
                            'component_type_id' => $component->component_type_id,
                            'component_type' => $component->componentType ? [
                                'id' => $component->componentType->id,
                                'name' => $component->componentType->name,
                                'category' => $component->componentType->category,
                                'icon' => $component->componentType->icon,
                            ] : null,
                            'sort_order' => $component->sort_order,
                            'is_visible' => $component->is_visible,
                            'props' => $component->props ? json_decode($component->props, true) : [],
                            'styles' => $component->styles ? json_decode($component->styles, true) : [],
                            'responsive_settings' => $component->responsive_settings ? json_decode($component->responsive_settings, true) : [],
                            'animation_settings' => $component->animation_settings ? json_decode($component->animation_settings, true) : [],
                            'meta_data' => $component->meta_data ? json_decode($component->meta_data, true) : [],
                        ];
                    })->toArray()
                ];
            })->toArray();

            return response()->json([
                'status' => 200,
                'message' => 'Page retrieved successfully',
                'data' => [
                    'id' => $page->id,
                    'title' => $page->title,
                    'slug' => $page->slug,
                    'type' => $page->type,
                    'description' => $page->description,
                    'content' => $page->content ? json_decode($page->content, true) : null,
                    'seo_meta' => $page->seo_meta,
                    'is_published' => $page->is_published,
                    'is_homepage' => $page->is_homepage,
                    'access_level' => $page->access_level,
                    'sort_order' => $page->sort_order,
                    'sections' => $sections,
                    'created_at' => $page->created_at,
                    'updated_at' => $page->updated_at
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error retrieving page: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pages for current store (since one store = one website)
     */
    public function getPages(Request $request): JsonResponse
    {
        try {
            $storeId = $this->getCurrentStoreId();
            
            // Get the store's website (should be only one)
            $website = StoreWebsite::where('store_id', $storeId)->first();
            
            if (!$website) {
                return response()->json([
                    'status' => 404,
                    'message' => 'No website found for this store',
                    'data' => []
                ]);
            }
            
            // Get pages directly
            $pages = \App\Modules\WebsiteBuilder\Models\WebsitePage::where('website_id', $website->id)
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->orderBy('created_at')
                ->get();

            return response()->json([
                'status' => 200,
                'message' => 'Pages retrieved successfully',
                'data' => $pages->map(function ($page) {
                    return [
                        'id' => $page->id,
                        'title' => $page->title,
                        'slug' => $page->slug,
                        'type' => $page->type,
                        'description' => $page->description,
                        'content' => $page->content ? json_decode($page->content, true) : null,
                        'seo_meta' => $page->seo_meta,
                        'is_published' => $page->is_published,
                        'is_homepage' => $page->is_homepage,
                        'access_level' => $page->access_level,
                        'sort_order' => $page->sort_order,
                        'created_at' => $page->created_at,
                        'updated_at' => $page->updated_at
                    ];
                })
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error retrieving pages: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * Helper method to get current store ID
     */
    protected function getCurrentStoreId(): int
    {
        // Temporary hardcoded store ID for testing (remove when auth is fixed)
        return 1; // Match the store_id for website ID 1
    }
}