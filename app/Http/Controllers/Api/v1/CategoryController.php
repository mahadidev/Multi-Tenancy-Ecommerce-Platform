<?php

namespace App\Http\Controllers\Api\v1;

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

        return response()->json([
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function show(Request $request, $id)
    {
        try {
            $category = Category::authorized()->findOrFail($id);

            return response()->json(
                [
                    'category' => new CategoryResource($category),
                ],
                200,
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'data not found',
                ],
                404,
            );
        }
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9\-]+$/', // Allows letters, numbers, and hyphens, but no spaces
            ],
            'type' => 'nullable|string|max:50|in:post,product', // Correct format for 'in' rule
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        // Automatically assign the authenticated user's ID
        // $validated['user_id'] = auth()->user()->id;
        $validated['store_id'] = authStore();

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, $id)
    {

        $category = Category::authorized()->findorfail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                // 'unique:categories,slug,' . $category->id, // Ignore the current category's slug
                'regex:/^[a-zA-Z0-9\-]+$/', // Allows letters, numbers, and hyphens, but no spaces
            ],
            'type' => 'nullable|string|max:50|in:post,product', // Correct format for 'in' rule
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        // Update the category
        $category->update($validated);

        return response()->json([
            'success' => true,
            'data' => $category,
        ], 200);
    }

    public function destroy($id)
    {
        // Find the store owned by the authenticated user
        $store = Category::authorized()->findorfail($id);

        // If the store doesn't exist or is not owned by the user, return an error
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to delete this store or it does not exist.',
            ], 403); // Forbidden
        }

        // Delete the store record
        $store->delete();

        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'Store deleted successfully.',
        ], 200);
    }
}
