<?php

namespace App\Http\Controllers\Api\v1\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\CategoryWiseProductsResource;

class ProductController extends Controller
{
    public function catgeories(Request $request)
    {
        $query = Category::authorized()->latest();

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        $categories = $query->get();

        if (!$categories) {
            return response()->json([
                'status' => 404,
                'message' => 'Categories not found',
            ]);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'categories' =>  CategoryResource::collection($categories),
            ],
        ]);
    }

    public function products(Request $request)
    {
        $query = Product::active()->authorized();
        $this->applyFiltersAndSorting($query, $request);
        $products = $query->get();

        if(!$products){
            return response()->json([
                'status' => 404,
                'message' => 'Products not found',
            ]);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'products' => ProductResource::collection($products),
            ],
        ]);
    }

    public function allCategoriesProducts(Request $request)
    {
        $categories = Category::authorized()->latest()->get();
        if (!$categories) {
            return response()->json([
                'status' => 404,
                'message' => 'Categories not found',
            ]);
        }

        $categoriesWiseProducts = Category::with(['product' => function ($query) use ($request) {
            $query->active() // Filter active products
                ->authorized(); // Filter authorized products
                // ->with('brand'); // Include the brand relationship
            $this->applyFiltersAndSorting($query, $request);
        }])
            ->authorized()
            ->latest()
            ->get();

        if (!$categoriesWiseProducts) {
            return response()->json([
                'status' => 404,
                'message' => 'Products not found',
            ]);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'products' => $categoriesWiseProducts->map(function ($category) {
                    return new CategoryWiseProductsResource($category);
                }),
            ],
        ]);
    }

    public function singleCategoryProducts(Request $request, $slug)
    {
        $category = Category::authorized()->where('slug', $request->slug)->first();
        if (!$category) {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found',
            ]);
        }

        $query = $category->product()
            ->active() // Scope for active products
            ->authorized() // Scope for authorized products
            ->get();

        $this->applyFiltersAndSorting($query, $request);

        $products = $query->get();

        // if (!$products) {
        //     return response()->json([
        //         'status' => 404,
        //         'message' => 'Products not found',
        //     ]);
        // }

        return response()->json([
            'status' => 200,
            'data' => [
                'category' => new CategoryResource($category),
                'products' => ProductResource::collection($products),
            ],
        ]);
    }

    protected function applyFiltersAndSorting($query, Request $request)
    {
        // Essential Filters

        // 1. Price Range - Most important for shoppers
        if ($request->has('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->has('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        // 2. Availability Filter - Critical for user experience
        if ($request->has('in_stock')) {
            $query->where('stock', '>', 0)
                ->where('has_in_stocks', true);
        }

        // 3. Discounts - Important for price-sensitive customers
        if ($request->has('on_sale')) {
            $query->where('has_discount', true)
                ->whereDate('discount_to', '>=', now());
        }

        // 4. Brand Filter - Key for brand-conscious shoppers
        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        // 5. Search - Essential for finding specific products
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        // 6. Trending Products - Important for showcasing popular products
        if ($request->has('is_trending')) {
            $query->where('is_trending', true);
        }

        // Essential Sorting
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Limited to most important sort options
        $allowedSortFields = [
            'created_at',    // Latest products
            'price',         // Price sorting
            'name',         // Alphabetical
            'is_trending',   // Trending products
        ];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        // Include essential relationships
        $query->with('brand');

        return $query;
    }
}
