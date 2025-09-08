<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsitePage;
use App\Modules\WebsiteBuilder\Requests\CreateWebsitePageRequest;
use App\Modules\WebsiteBuilder\Requests\UpdateWebsitePageRequest;
use App\Modules\WebsiteBuilder\Services\PageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebsitePageController extends Controller
{
    protected $pageService;

    public function __construct(PageService $pageService)
    {
        $this->pageService = $pageService;
    }

    public function index($websiteId): JsonResponse
    {
        $storeId = authStore();
        
        $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
        
        $pages = $website->pages()
            ->with(['sections.components.componentType'])
            ->ordered()
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Pages retrieved successfully',
            'data' => $pages
        ]);
    }

    public function show($websiteId, $pageId): JsonResponse
    {
        $storeId = authStore();
        
        $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
        
        $page = $website->pages()
            ->with(['sections.components.componentType'])
            ->findOrFail($pageId);

        // Decode Elementor content if it exists
        if ($page->content) {
            try {
                $page->elementor_data = json_decode($page->content, true);
            } catch (\Exception $e) {
                // If JSON decode fails, keep content as string
                $page->elementor_data = null;
            }
        } else {
            $page->elementor_data = null;
        }

        return response()->json([
            'status' => 200,
            'message' => 'Page retrieved successfully',
            'data' => $page
        ]);
    }

    public function store($websiteId, CreateWebsitePageRequest $request): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            
            $data = array_merge($request->validated(), ['website_id' => $website->id]);
            $page = $this->pageService->createPage($data);

            return response()->json([
                'status' => 201,
                'message' => 'Page created successfully',
                'data' => $page
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to create page: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update($websiteId, $pageId, UpdateWebsitePageRequest $request): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            $page = $website->pages()->findOrFail($pageId);
            
            $page = $this->pageService->updatePage($page, $request->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Page updated successfully',
                'data' => $page
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update page: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($websiteId, $pageId): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            $page = $website->pages()->findOrFail($pageId);
            
            $page->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Page deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to delete page: ' . $e->getMessage()
            ], 500);
        }
    }

    public function duplicate($websiteId, $pageId): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            $page = $website->pages()->findOrFail($pageId);
            
            $duplicatePage = $this->pageService->duplicatePage($page);

            return response()->json([
                'status' => 201,
                'message' => 'Page duplicated successfully',
                'data' => $duplicatePage
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to duplicate page: ' . $e->getMessage()
            ], 500);
        }
    }

    public function setHomepage($websiteId, $pageId): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            $page = $website->pages()->findOrFail($pageId);
            
            $this->pageService->setAsHomepage($page);

            return response()->json([
                'status' => 200,
                'message' => 'Homepage set successfully',
                'data' => $page
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to set homepage: ' . $e->getMessage()
            ], 500);
        }
    }

    public function reorder($websiteId, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'pages' => 'required|array',
                'pages.*.id' => 'required|exists:website_pages,id',
                'pages.*.sort_order' => 'required|integer|min:0',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            
            $this->pageService->reorderPages($website, $request->pages);

            return response()->json([
                'status' => 200,
                'message' => 'Pages reordered successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to reorder pages: ' . $e->getMessage()
            ], 500);
        }
    }
}