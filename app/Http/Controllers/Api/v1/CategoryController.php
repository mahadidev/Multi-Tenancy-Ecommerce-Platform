<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::latest();

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
            $category = Category::findOrFail($id);

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
}
