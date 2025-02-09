<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;

use App\Models\StoreMenu;
use Illuminate\Http\Request;
use App\Http\Resources\StoreMenuResource;

class StoreMenuController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort'); // Sort order
        $perPage = $request->input('per_page'); // Items per page

        $menus = StoreMenu::query()
            ->where('store_id', authStore()->id)
            ->when($search, function ($query, $search) {
                $query->where('label', 'like', '%' . $search . '%')
                    ->orWhere('name', 'like', '%' . $search . '%');
            })
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        if(!$menus){
            return response()->json([
                'status' => 404,
                'message' => 'Store menu not found.',
            ], 404);
        }

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $menus->paginate($perPage) : $menus->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'menus' => StoreMenuResource::collection($paginated),
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
            'name' => 'required|string',
        ]);

        $validatedData['store_id'] = authStore()->id;

        $menu = StoreMenu::create($validatedData);

        return response()->json([
            'status' => 200,
            'message' => 'Store menu created successfully.',
            'data' => new StoreMenuResource($menu),
        ], 200);
    }

    public function view(Request $request, $id)
    {
        $menu = StoreMenu::where('store_id', authStore()->id)->find($id);

        if (!$menu) {
            return response()->json([
                'status' => 404,
                'message' => 'Store menu not found.',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'menu' => new StoreMenuResource($menu),
            ],
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $menu = StoreMenu::where('store_id', authStore()->id)->find($id);

        if (!$menu) {
            return response()->json([
                'status' => 404,
                'message' => 'Store menu not found.',
            ], 404);
        }

        $validatedData = $request->validate([
            'label' => 'sometimes|required|string',
            'name' => 'sometimes|required|string',
        ]);

        $validatedData['store_id'] = authStore()->id;

        $menu->update($validatedData);

        return response()->json([
            'status' => 200,
            'message' => 'Store menu updated successfully.',
            'data' => new StoreMenuResource($menu),
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $menu = StoreMenu::where('store_id', authStore()->id)->find($id);

        if (!$menu) {
            return response()->json([
                'status' => 404,
                'message' => 'Store menu not found.',
            ], 404);
        }

        $menu->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Store menu deleted successfully.',
        ], 200);
    }
}
