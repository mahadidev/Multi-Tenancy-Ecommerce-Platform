<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\WebsitePage;
use App\Modules\WebsiteBuilder\Models\PageSection;
use App\Modules\WebsiteBuilder\Services\PageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageSectionController extends Controller
{
    protected $pageService;

    public function __construct(PageService $pageService)
    {
        $this->pageService = $pageService;
    }

    public function index($pageId): JsonResponse
    {
        // Verify page ownership through website's store
        $page = WebsitePage::with('website')->findOrFail($pageId);
        $storeId = authStore();
        
        if ($page->website->store_id !== $storeId) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized'
            ], 403);
        }

        $sections = $page->sections()
            ->with(['components.componentType'])
            ->ordered()
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Sections retrieved successfully',
            'data' => $sections
        ]);
    }

    public function show($pageId, $sectionId): JsonResponse
    {
        // Verify ownership
        $page = WebsitePage::with('website')->findOrFail($pageId);
        $storeId = authStore();
        
        if ($page->website->store_id !== $storeId) {
            return response()->json([
                'status' => 403,
                'message' => 'Unauthorized'
            ], 403);
        }

        $section = $page->sections()
            ->with(['components.componentType'])
            ->findOrFail($sectionId);

        return response()->json([
            'status' => 200,
            'message' => 'Section retrieved successfully',
            'data' => $section
        ]);
    }

    public function store($pageId, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'nullable|string|max:255',
                'type' => 'required|string|in:section,header,footer,sidebar',
                'container_styles' => 'nullable|json',
                'sort_order' => 'nullable|integer|min:0',
                'is_visible' => 'boolean',
                'responsive_settings' => 'nullable|json',
                'meta_data' => 'nullable|json',
            ]);

            // Verify page ownership
            $page = WebsitePage::with('website')->findOrFail($pageId);
            $storeId = authStore();
            
            if ($page->website->store_id !== $storeId) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $section = $this->pageService->createSection($page, $request->all());

            return response()->json([
                'status' => 201,
                'message' => 'Section created successfully',
                'data' => $section
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to create section: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update($pageId, $sectionId, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'nullable|string|max:255',
                'type' => 'sometimes|required|string|in:section,header,footer,sidebar',
                'container_styles' => 'nullable|json',
                'sort_order' => 'nullable|integer|min:0',
                'is_visible' => 'boolean',
                'responsive_settings' => 'nullable|json',
                'meta_data' => 'nullable|json',
            ]);

            // Verify ownership
            $page = WebsitePage::with('website')->findOrFail($pageId);
            $storeId = authStore();
            
            if ($page->website->store_id !== $storeId) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $section = $page->sections()->findOrFail($sectionId);
            $section = $this->pageService->updateSection($section, $request->all());

            return response()->json([
                'status' => 200,
                'message' => 'Section updated successfully',
                'data' => $section
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update section: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($pageId, $sectionId): JsonResponse
    {
        try {
            // Verify ownership
            $page = WebsitePage::with('website')->findOrFail($pageId);
            $storeId = authStore();
            
            if ($page->website->store_id !== $storeId) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $section = $page->sections()->findOrFail($sectionId);
            $this->pageService->deleteSection($section);

            return response()->json([
                'status' => 200,
                'message' => 'Section deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to delete section: ' . $e->getMessage()
            ], 500);
        }
    }

    public function duplicate($pageId, $sectionId): JsonResponse
    {
        try {
            // Verify ownership
            $page = WebsitePage::with('website')->findOrFail($pageId);
            $storeId = authStore();
            
            if ($page->website->store_id !== $storeId) {
                return response()->json([
                    'status' => 403,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $section = $page->sections()->findOrFail($sectionId);
            $duplicateSection = $this->pageService->duplicateSection($section);

            return response()->json([
                'status' => 201,
                'message' => 'Section duplicated successfully',
                'data' => $duplicateSection
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to duplicate section: ' . $e->getMessage()
            ], 500);
        }
    }
}