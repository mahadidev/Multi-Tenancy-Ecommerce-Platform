<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductBrand;
use Illuminate\Support\Facades\Storage;

class ProductBrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return apiResponse(function () use ($request) {
            $brands = ProductBrand::authorized()->latest();

            return response()->json([
                'brands' => $brands,
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
                'image' => 'nullable|image',
            ]);

            $validated['store_id'] = authStore();

            $imagePath = null;
            if ($request->hasFile('image') && isset($request->image)) {
                $imagePath = $request->file('image')->store('brand-images', 'public');
            }

            $brand = ProductBrand::create([
                'name' => $validated['name'],
                'store_id' => $validated['store_id'],
                'image' => $imagePath ? $imagePath : null,
            ]);

            return response()->json(
                [
                    'success' => true,
                    'message' => 'Brand created successfully',
                    'brand' => $brand,
                ]
            );
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $brand = ProductBrand::authorized()->findOrFail($id);
            return response()->json(
                [
                    'success' => true,
                    'brand' => $brand,
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
            $brand = ProductBrand::authorized()->findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'image' => 'nullable|image',
            ]);

            $imagePath = null;
            if ($request->hasFile('image') && isset($request->image)) {
                if($brand->image) {
                    Storage::disk('public')->delete($brand->image);
                }
                $imagePath = $request->file('image')->store('brand-images', 'public');
            }

            $brand->update([
                'name' => $validated['name'],
                'image' => $imagePath ? $imagePath : $brand->image,
            ]);

            return response()->json(
                [
                    'success' => true,
                    'message' => 'Brand updated successfully',
                    'brand' => $brand,
                ]
            );
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return apiResponse(function () use ($id) {
            $brand = ProductBrand::authorized()->findOrFail($id);

            if($brand->image) {
                Storage::disk('public')->delete($brand->image);
            }

            $brand->delete();

            return response()->json(
                [
                    'success' => true,
                    'message' => 'Brand deleted successfully',
                ]
            );
        });
    }
}
