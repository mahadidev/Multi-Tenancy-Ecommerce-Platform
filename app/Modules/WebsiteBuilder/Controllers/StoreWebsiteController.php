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
        $storeId = authStore();
        
        $websites = StoreWebsite::byStore($storeId)
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
}