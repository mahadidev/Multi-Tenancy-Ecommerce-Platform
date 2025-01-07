<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Resources\CategoryResource;


class BlogCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return apiResponse(function () use ($request) {
            $query = Category::authorized()->latest();

            if ($request->has('type')) {
                $query->where('type', $request->input('type'));
            }

            $categories = $query->get();

            return response()->json([
                'status' => 200,
                'categories' => CategoryResource::collection($categories),
            ]);
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return apiResponse(function () use ($request) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:50|in:post,product', // Correct format for 'in' rule
            ]);

            $validated['store_id'] = authStore();

            $category = Category::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Blog Category created successfully',
                'data' => $category,
            ]);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $query = Category::authorized();

            if ($request->has('type')) {
                $query->where('type', $request->input('type'));
            }

            $category = $query->findorfail($id);

            return response()->json(
                [
                    'success' => true,
                    'category' => new CategoryResource($category),
                ]
            );
        });
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $category = Category::authorized()->findorfail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:50|in:post,product', // Correct format for 'in' rule
            ]);

            // Update the category
            $category->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $category,
            ]);
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $category = Category::authorized()->findorfail($id);

            if(!$category){
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this store or it does not exist.',
                ]);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully',
            ]);
        });
    }
}
