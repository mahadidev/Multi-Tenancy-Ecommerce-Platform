<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;

use App\Models\StoreMenuItem;
use Illuminate\Http\Request;
use App\Http\Resources\StoreMenuItemResource;

class StoreMenuItemController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort'); // Sort order
        $perPage = $request->input('per_page'); // Items per page

        $menuItems = StoreMenuItem::query()
            ->where('store_menu_id', $request->store_menu_id)
            ->when($search, function ($query, $search) {
                $query->where('label', 'like', '%' . $search . '%')
                      ->orWhere('href', 'like', '%' . $search . '%');
            })
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        if (!$menuItems) {
            return response()->json([
                'status' => 404,
                'message' => 'Store menu items not found.',
            ], 404);
        }

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $menuItems->paginate($perPage) : $menuItems->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'menu_items' => StoreMenuItemResource::collection($paginated),
            ],
        ];

        // Add pagination meta data if `per_page` is provided
        if ($perPage) {
            $response['meta'] = [
                'current_page' => $paginated->currentPage(),
                'first_page_url' => $paginated->url(1),
                'last_page' => $paginated->lastPage(),
                'last_page_url' => $paginated->url($paginated->lastPage()),
                'next_page_url' => $paginated->nextPageUrl(),
                'prev_page_url' => $paginated->previousPageUrl(),
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
            ];
        }

        return response()->json($response, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'label' => 'required|string',
            'href' => 'required|string',
            'store_menu_id' => 'required|exists:store_menus,id',
            'visibility' => 'sometimes|in:user,guest,all',
        ]);

        $menuItem = StoreMenuItem::create($validatedData);

        return response()->json([
            'status' => 200,
            'message' => 'Store menu item created successfully.',
            'data' => new StoreMenuItemResource($menuItem),
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $menuItem = StoreMenuItem::where('store_menu_id', $request->store_menu_id)->find($id); 

        if (!$menuItem) {
            return response()->json([
                'status' => 404,
                'message' => 'Store menu item not found.',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'menu_item' => new StoreMenuItemResource($menuItem),
            ],
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'label' => 'sometimes|required|string',
            'href' => 'sometimes|required|string',
            'store_menu_id' => 'sometimes|required|exists:store_menus,id',
            'visibility' => 'sometimes|in:user,guest,all',
        ]);

        $menuItem = StoreMenuItem::where('store_menu_id', $request->store_menu_id)->find($id);

        if (!$menuItem) {
            return response()->json([
                'status' => 404,
                'message' => 'Store menu item not found.',
            ], 404);
        }

        $menuItem->update($validatedData);

        return response()->json([
            'status' => 200,
            'message' => 'Store menu item updated successfully.',
            'data' => new StoreMenuItemResource($menuItem),
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $menuItem = StoreMenuItem::where('store_menu_id', $request->store_menu_id)->find($id);

        if (!$menuItem) {
            return response()->json([
                'status' => 404,
                'message' => 'Store menu item not found.',
            ], 404);
        }

        $menuItem->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Store menu item deleted successfully.',
        ], 200);
    }
}