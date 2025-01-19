<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\BrandResource;
use Illuminate\Http\Request;
use App\Models\Brand;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        // Retrieve query parameters
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort', 'desc'); // Sort order, default is 'desc'
        $perPage = $request->input('per_page', 10); // Items per page, default is 10

        // Fetch brands with optional search and sorting, paginated
        $brands = Brand::authorized()
            ->when($search, function ($query, $search) {
                $query
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%')
                    ->where('store_id', authStore());
            })
            ->orderBy('created_at', $sort) // Sort by 'created_at' in the specified order
            ->paginate($perPage);

        return response()->json(
            [
                'status' => 200,
                'data' => BrandResource::collection($brands),
                'meta' => [
                    'current_page' => $brands->currentPage(),
                    'first_page_url' => $brands->url(1),
                    'last_page' => $brands->lastPage(),
                    'last_page_url' => $brands->url($brands->lastPage()),
                    'next_page_url' => $brands->nextPageUrl(),
                    'prev_page_url' => $brands->previousPageUrl(),
                    'total' => $brands->total(),
                    'per_page' => $brands->perPage(),
                ],
            ],
            200,
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
        ]);

        $validated['store_id'] = authStore();

        $brand = Brand::create([
            'name' => $validated['name'],
            'store_id' => $validated['store_id'],
            'image' => $validated['image'] ?? null,
        ]);

        return response()->json(
            [
                'status' => 200,
                'message' => 'Brand created successfully',
                'data' => new BrandResource($brand),
            ],
            200,
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $brand = Brand::authorized()->find($id);

        if (!$brand) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Brand not found',
                ],
                404,
            );
        }

        return response()->json(
            [
                'status' => 200,
                'data' => new BrandResource($brand),
            ],
            200,
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $brand = Brand::authorized()->find($id);

        if (!$brand) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Brand not found',
                ],
                404,
            );
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
        ]);

        $brand->update([
            'name' => $validated['name'] ?? $brand->name,
            'image' => $validated['image'] ?? $brand->image,
        ]);

        return response()->json(
            [
                'status' => 200,
                'message' => 'Brand updated successfully',
                'data' => new BrandResource($brand),
            ],
            200,
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $brand = Brand::authorized()->find($id);

        if (!$brand) {
            return response()->json(
                [
                    'status' => 404,
                    'message' => 'Brand not found',
                ],
                404,
            );
        }

        if ($brand->image) {
            Storage::disk('public')->delete($brand->image);
        }

        $brand->delete();

        return response()->json(
            [
                'success' => 200,
                'message' => 'Brand deleted successfully',
            ],
            200,
        );
    }
}
