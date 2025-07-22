<?php

namespace App\Services\ProductServices;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;

class ProductFetcherService
{
    public function index(Request $request)
    {
        $sort = $request->input('sort');
        $perPage = $request->input('per_page');

        $query = Product::authorized();
        $this->applyFilters($query, $request);

        $products = $query->when($sort, fn($q) => $q->orderBy('created_at', $sort), fn($q) => $q->latest());

        return ProductResource::collection($perPage ? $products->paginate($perPage) : $products->get());
    }

    public function show($id)
    {
        $product = Product::with('category', 'store', 'variants', 'brand')->authorized()->find($id);
        return $product ? new ProductResource($product) : null;
    }

    protected function applyFilters($query, Request $request)
    {
        if ($request->filled('price_min'))
            $query->where('price', '>=', $request->price_min);
        if ($request->filled('price_max'))
            $query->where('price', '<=', $request->price_max);
        if ($request->boolean('in_stock'))
            $query->where('stock', '>', 0)->where('has_in_stocks', true);
        if ($request->boolean('on_sale'))
            $query->where('has_discount', true)->whereDate('discount_to', '>=', now());
        if ($request->filled('brand_id'))
            $query->where('brand_id', $request->brand_id);
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }
        if ($request->boolean('is_trending'))
            $query->where('is_trending', true);
        if ($request->filled('category_id'))
            $query->where('category_id', $request->category_id);
        if ($request->boolean('is_featured'))
            $query->where('is_featured', true);
    }
}
