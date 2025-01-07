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

        $categories = $query->get();

        return apiResponse(function () use ($request, $categories) {
            return response()->json([
                'status' => 200,
                'data' => [
                    'categories' =>  CategoryResource::collection($categories),
                ],
            ]);
        });
    }

    public function show(Request $request, $id)
    {
        
        return apiResponse(function () use ($request, $id) {

            $category = Category::authorized()->findOrFail($id);
            return response()->json([
                'status' => 200,
                'data' => [
                    'category' => new CategoryResource($category),
                ],
            ]);
        });
    }

    public function store(Request $request)
    {

        return apiResponse(function () use ($request) {

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
                'data' => [
                    'category' => new CategoryResource($category),
                ],
            ]);
        });
    }

    public function update(Request $request, $id)
    {

        $category = Category::authorized()->findorfail($id);
        return apiResponse(function () use ($request, $category) {

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'nullable|string|max:50|in:post,product', // Correct format for 'in' rule
                'parent_id' => 'nullable|exists:categories,id',
            ]);

            // Update the category
            $category->update($validated);

            return response()->json([
                'status' => 200,
                'data' => [
                    'category' => new CategoryResource($category),
                ],
            ]);
        });
    }

    public function destroy(Request $request, $id)
    {

        return apiResponse(function () use ($request, $id) {

            $category = Category::authorized()->findorfail($id);
            $category->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Category deleted successfully'
            ]);
        });
      
    }
}
