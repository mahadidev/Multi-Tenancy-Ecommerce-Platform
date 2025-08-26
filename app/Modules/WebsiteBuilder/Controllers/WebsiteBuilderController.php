<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsitePage;
use App\Modules\WebsiteBuilder\Models\ComponentType;
use App\Modules\WebsiteBuilder\Models\WebsiteTemplate;
use App\Modules\WebsiteBuilder\Models\PageSection;
use App\Modules\WebsiteBuilder\Models\SectionComponent;
use App\Modules\WebsiteBuilder\Services\WebsiteBuilderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WebsiteBuilderController extends Controller
{
    protected $builderService;

    public function __construct(WebsiteBuilderService $builderService)
    {
        $this->builderService = $builderService;
    }

    /**
     * Get all available themes/templates
     */
    public function getThemes(Request $request): JsonResponse
    {
        try {
            $category = $request->get('category');
            $search = $request->get('search');

            $query = WebsiteTemplate::where('is_active', true);

            if ($category && $category !== 'all') {
                $query->where('category', $category);
            }

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%");
                });
            }

            $themes = $query->orderBy('is_premium')->orderBy('name')->get();

            return response()->json([
                'status' => 200,
                'data' => $themes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching themes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available component types
     */
    public function getComponents(Request $request): JsonResponse
    {
        try {
            $category = $request->get('category');

            $query = ComponentType::with('category')->where('is_active', true);

            if ($category && $category !== 'all') {
                $query->whereHas('category', function($q) use ($category) {
                    $q->where('slug', $category);
                });
            }

            $components = $query->orderBy('sort_order')->orderBy('name')->get();

            // Group by category name
            $groupedComponents = $components->groupBy(function($component) {
                return $component->category ? $component->category->name : 'Uncategorized';
            });

            return response()->json([
                'status' => 200,
                'data' => [
                    'components' => $components,
                    'grouped' => $groupedComponents,
                    'categories' => $components->map(function($component) {
                        return $component->category ? $component->category->name : 'Uncategorized';
                    })->unique()->values()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching components: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Apply a theme to store website
     */
    public function applyTheme(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'theme_slug' => 'required|string',
                'store_id' => 'required|exists:stores,id',
                'customize_colors' => 'boolean',
                'colors' => 'array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $theme = WebsiteTemplate::where('slug', $request->theme_slug)->first();
            if (!$theme) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Theme not found'
                ], 404);
            }

            $result = $this->builderService->applyThemeToWebsite(
                $request->store_id,
                $theme,
                $request->get('customize_colors', false),
                $request->get('colors', [])
            );

            return response()->json([
                'status' => 200,
                'message' => 'Theme applied successfully',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error applying theme: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get website pages for builder
     */
    public function getWebsitePages(Request $request, $websiteId): JsonResponse
    {
        try {
            $website = StoreWebsite::findOrFail($websiteId);
            
            // Check permission
            if ($website->store_id !== Auth::user()->store_id) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $pages = $website->pages()
                ->with(['sections.components.componentType'])
                ->orderBy('is_homepage', 'desc')
                ->orderBy('created_at')
                ->get();

            return response()->json([
                'status' => 200,
                'data' => $pages
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching pages: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save page sections (page builder data)
     */
    public function savePageSections(Request $request, $pageId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'sections' => 'required|array',
                'sections.*.componentType' => 'required|string',
                'sections.*.props' => 'array',
                'sections.*.isVisible' => 'boolean',
                'sections.*.order' => 'integer'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $page = WebsitePage::findOrFail($pageId);
            
            // Check permission
            if ($page->website->store_id !== Auth::user()->store_id) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            DB::beginTransaction();
            try {
                // Clear existing sections
                $page->sections()->delete();

                // Create new sections
                foreach ($request->sections as $index => $sectionData) {
                    $componentType = ComponentType::where('type', $sectionData['componentType'])->first();
                    
                    if (!$componentType) {
                        continue;
                    }

                    $section = PageSection::create([
                        'page_id' => $page->id,
                        'name' => $componentType->name,
                        'type' => $componentType->category,
                        'settings' => $sectionData['props'] ?? [],
                        'sort_order' => $sectionData['order'] ?? $index,
                        'is_visible' => $sectionData['isVisible'] ?? true
                    ]);

                    // Create section component
                    SectionComponent::create([
                        'section_id' => $section->id,
                        'component_type_id' => $componentType->id,
                        'props' => $sectionData['props'] ?? [],
                        'sort_order' => 0,
                        'is_visible' => $sectionData['isVisible'] ?? true
                    ]);
                }

                DB::commit();

                return response()->json([
                    'status' => 200,
                    'message' => 'Page saved successfully'
                ]);

            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error saving page: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new page
     */
    public function createPage(Request $request, $websiteId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'slug' => 'required|string|max:255',
                'description' => 'nullable|string',
                'seo_title' => 'nullable|string|max:255',
                'seo_description' => 'nullable|string|max:255',
                'is_homepage' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $website = StoreWebsite::findOrFail($websiteId);
            
            // Check permission
            if ($website->store_id !== Auth::user()->store_id) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Check if slug already exists
            $existingPage = $website->pages()->where('slug', $request->slug)->first();
            if ($existingPage) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Page with this URL already exists'
                ], 400);
            }

            // If setting as homepage, update other pages
            if ($request->get('is_homepage', false)) {
                $website->pages()->update(['is_homepage' => false]);
            }

            $page = WebsitePage::create([
                'website_id' => $website->id,
                'title' => $request->title,
                'slug' => $request->slug,
                'description' => $request->description,
                'seo_meta' => [
                    'title' => $request->seo_title,
                    'description' => $request->seo_description
                ],
                'is_homepage' => $request->get('is_homepage', false),
                'is_published' => true
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Page created successfully',
                'data' => $page->load(['sections.components.componentType'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error creating page: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update page settings
     */
    public function updatePageSettings(Request $request, $pageId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'string|max:255',
                'slug' => 'string|max:255',
                'description' => 'nullable|string',
                'seo_title' => 'nullable|string|max:255',
                'seo_description' => 'nullable|string|max:255',
                'is_homepage' => 'boolean',
                'is_published' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $page = WebsitePage::findOrFail($pageId);
            
            // Check permission
            if ($page->website->store_id !== Auth::user()->store_id) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Check slug uniqueness if changing
            if ($request->has('slug') && $request->slug !== $page->slug) {
                $existingPage = $page->website->pages()->where('slug', $request->slug)->first();
                if ($existingPage) {
                    return response()->json([
                        'status' => 400,
                        'message' => 'Page with this URL already exists'
                    ], 400);
                }
            }

            // If setting as homepage, update other pages
            if ($request->get('is_homepage', false) && !$page->is_homepage) {
                $page->website->pages()->update(['is_homepage' => false]);
            }

            $updateData = $request->only(['title', 'slug', 'description', 'is_homepage', 'is_published']);
            
            if ($request->has('seo_title') || $request->has('seo_description')) {
                $updateData['seo_meta'] = array_merge($page->seo_meta ?? [], [
                    'title' => $request->seo_title,
                    'description' => $request->seo_description
                ]);
            }

            $page->update($updateData);

            return response()->json([
                'status' => 200,
                'message' => 'Page updated successfully',
                'data' => $page->refresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error updating page: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete page
     */
    public function deletePage($pageId): JsonResponse
    {
        try {
            $page = WebsitePage::findOrFail($pageId);
            
            // Check permission
            if ($page->website->store_id !== Auth::user()->store_id) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Prevent deletion of homepage
            if ($page->is_homepage) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Cannot delete homepage. Please set another page as homepage first.'
                ], 400);
            }

            $page->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Page deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error deleting page: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Duplicate page
     */
    public function duplicatePage(Request $request, $pageId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'slug' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $originalPage = WebsitePage::with(['sections.components'])->findOrFail($pageId);
            
            // Check permission
            if ($originalPage->website->store_id !== Auth::user()->store_id) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Check slug uniqueness
            $existingPage = $originalPage->website->pages()->where('slug', $request->slug)->first();
            if ($existingPage) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Page with this URL already exists'
                ], 400);
            }

            DB::beginTransaction();
            try {
                // Create new page
                $newPage = WebsitePage::create([
                    'website_id' => $originalPage->website_id,
                    'title' => $request->title,
                    'slug' => $request->slug,
                    'description' => $originalPage->description,
                    'seo_meta' => $originalPage->seo_meta,
                    'page_settings' => $originalPage->page_settings,
                    'is_homepage' => false,
                    'is_published' => false
                ]);

                // Duplicate sections and components
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

                return response()->json([
                    'status' => 200,
                    'message' => 'Page duplicated successfully',
                    'data' => $newPage->load(['sections.components.componentType'])
                ]);

            } catch (\Exception $e) {
                DB::rollback();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error duplicating page: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get website settings
     */
    public function getWebsiteSettings($websiteId): JsonResponse
    {
        try {
            $website = StoreWebsite::with('store')->findOrFail($websiteId);
            
            // Check permission
            if ($website->store_id !== Auth::user()->store_id) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            return response()->json([
                'status' => 200,
                'data' => [
                    'website' => $website,
                    'theme' => $website->template,
                    'store' => $website->store
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching website settings: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update website settings
     */
    public function updateWebsiteSettings(Request $request, $websiteId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'string|max:255',
                'description' => 'nullable|string',
                'favicon' => 'nullable|string',
                'seo_meta' => 'array',
                'global_styles' => 'array',
                'is_published' => 'boolean',
                'is_maintenance_mode' => 'boolean',
                'maintenance_message' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 400);
            }

            $website = StoreWebsite::findOrFail($websiteId);
            
            // Check permission
            if ($website->store_id !== Auth::user()->store_id) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $updateData = $request->only([
                'title', 'description', 'favicon', 'seo_meta', 'global_styles',
                'is_published', 'is_maintenance_mode', 'maintenance_message'
            ]);

            // Set published timestamp if publishing for first time
            if ($request->has('is_published') && $request->is_published && !$website->published_at) {
                $updateData['published_at'] = now();
            }

            $website->update($updateData);

            return response()->json([
                'status' => 200,
                'message' => 'Website settings updated successfully',
                'data' => $website->refresh()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error updating website settings: ' . $e->getMessage()
            ], 500);
        }
    }
}