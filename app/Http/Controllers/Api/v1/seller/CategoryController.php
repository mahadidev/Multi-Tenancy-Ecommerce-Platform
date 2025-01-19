<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
// use App\Services\StoreService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::authorized()->latest();

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 10); // Items per page, default is 10

        $categories = $query->paginate($perPage)->appends($request->only(['type', 'search', 'per_page']));

        return response()->json([
            'status' => 200,
            'data' =>  CategoryResource::collection($categories),
            'meta' => [
                'current_page' => $categories->currentPage(),
                'first_page_url' => $categories->url(1),
                'last_page' => $categories->lastPage(),
                'last_page_url' => $categories->url($categories->lastPage()),
                'next_page_url' => $categories->nextPageUrl(),
                'prev_page_url' => $categories->previousPageUrl(),
                'total' => $categories->total(),
                'per_page' => $categories->perPage(),
            ],
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $category = Category::authorized()->find($id);
        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => new CategoryResource($category),
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:50|in:post,product', // Correct format for 'in' rule
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        // Automatically assign the authenticated user's ID
        $validated['store_id'] = authStore();

        $category = Category::create($validated);

        return response()->json([
            'status' => 200,
            'message' => 'Category created successfully',
            'data' => new CategoryResource($category),
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $category = Category::authorized()->find($id);
        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:50|in:post,product', // Correct format for 'in' rule
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        // Update the category
        $category->update($validated);

        return response()->json([
            'status' => 200,
            'message' => 'Category updated successfully',
            'data' => new CategoryResource($category),
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $category = Category::authorized()->find($id);
        
        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found'
            ], 404);
        }
        $category->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Category deleted successfully'
        ], 200);

    }
}
