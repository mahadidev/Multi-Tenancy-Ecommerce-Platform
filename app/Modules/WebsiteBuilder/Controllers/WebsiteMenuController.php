<?php

namespace App\Modules\WebsiteBuilder\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\WebsiteBuilder\Models\StoreWebsite;
use App\Modules\WebsiteBuilder\Models\WebsiteMenu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebsiteMenuController extends Controller
{
    public function index($websiteId): JsonResponse
    {
        $storeId = authStore();
        
        $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
        
        $menus = $website->menus()->get();

        return response()->json([
            'status' => 200,
            'message' => 'Menus retrieved successfully',
            'data' => $menus
        ]);
    }

    public function show($websiteId, $menuId): JsonResponse
    {
        $storeId = authStore();
        
        $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
        $menu = $website->menus()->findOrFail($menuId);

        return response()->json([
            'status' => 200,
            'message' => 'Menu retrieved successfully',
            'data' => $menu
        ]);
    }

    public function store($websiteId, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'location' => 'required|string|in:header,footer,sidebar,mobile',
                'items' => 'nullable|array',
                'items.*.title' => 'required|string|max:255',
                'items.*.url' => 'required|string|max:500',
                'items.*.type' => 'required|string|in:page,product,category,external,custom',
                'items.*.target' => 'sometimes|string|in:_self,_blank',
                'items.*.parent_id' => 'nullable|integer',
                'items.*.sort_order' => 'nullable|integer',
                'styles' => 'nullable|array',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);

            // Process menu items with proper structure
            $menuItems = [];
            if ($request->has('items')) {
                foreach ($request->items as $index => $item) {
                    $menuItems[] = [
                        'id' => $index + 1,
                        'title' => $item['title'],
                        'url' => $item['url'],
                        'type' => $item['type'],
                        'target' => $item['target'] ?? '_self',
                        'parent_id' => $item['parent_id'] ?? null,
                        'sort_order' => $item['sort_order'] ?? $index + 1,
                        'is_active' => true,
                    ];
                }
            }

            $menu = WebsiteMenu::create([
                'website_id' => $website->id,
                'name' => $request->name,
                'location' => $request->location,
                'items' => $menuItems,
                'styles' => $request->styles ?? [],
                'is_active' => true,
            ]);

            return response()->json([
                'status' => 201,
                'message' => 'Menu created successfully',
                'data' => $menu
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to create menu: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update($websiteId, $menuId, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'location' => 'sometimes|required|string|in:header,footer,sidebar,mobile',
                'items' => 'nullable|array',
                'items.*.title' => 'required|string|max:255',
                'items.*.url' => 'required|string|max:500',
                'items.*.type' => 'required|string|in:page,product,category,external,custom',
                'items.*.target' => 'sometimes|string|in:_self,_blank',
                'items.*.parent_id' => 'nullable|integer',
                'items.*.sort_order' => 'nullable|integer',
                'styles' => 'nullable|array',
                'is_active' => 'boolean',
            ]);

            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            $menu = $website->menus()->findOrFail($menuId);

            $updateData = $request->only(['name', 'location', 'is_active']);
            
            if ($request->has('items')) {
                $menuItems = [];
                foreach ($request->items as $index => $item) {
                    $menuItems[] = [
                        'id' => $item['id'] ?? $index + 1,
                        'title' => $item['title'],
                        'url' => $item['url'],
                        'type' => $item['type'],
                        'target' => $item['target'] ?? '_self',
                        'parent_id' => $item['parent_id'] ?? null,
                        'sort_order' => $item['sort_order'] ?? $index + 1,
                        'is_active' => $item['is_active'] ?? true,
                    ];
                }
                $updateData['items'] = $menuItems;
            }
            
            if ($request->has('styles')) {
                $updateData['styles'] = $request->styles ?? [];
            }

            $menu->update($updateData);

            return response()->json([
                'status' => 200,
                'message' => 'Menu updated successfully',
                'data' => $menu
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to update menu: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($websiteId, $menuId): JsonResponse
    {
        try {
            $storeId = authStore();
            $website = StoreWebsite::byStore($storeId)->findOrFail($websiteId);
            $menu = $website->menus()->findOrFail($menuId);

            $menu->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Menu deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to delete menu: ' . $e->getMessage()
            ], 500);
        }
    }
}