<?php

namespace App\Services\ProductServices;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Services\ProductServices\ProductVariantService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ProductCreatorService
{
    protected $productVariantService;

    public function __construct() {
        $this->productVariantService = new ProductVariantService();
    }

    public function handle(Request $request)
    {
        $validatedData = $this->validate($request);
        $validatedData['store_id'] = authStore();

        if (isset($validatedData["discount_amount"]) && !isset($validatedData["discount_to"])) {
            $validatedData["discount_to"] = Carbon::now()->addYears(10);
        }

        if (isset($validatedData["discount_amount"]) && !isset($validatedData["has_discount"])) {
            $validatedData["has_discount"] = true;
        }

        $product = Product::create($validatedData);

        $productRecord = new \App\Services\ProductHistoryService();
        $product->qty = $product->stock ?? 0;
        $productRecord->recordProductCreation($product);

        if ($request->has('variants') && isset($validatedData["variants"])) {
            $this->productVariantService->createOrUpdateVariants($product, $request->variants);
        }

        return new ProductResource($product);
    }

    protected function validate(Request $request)
    {
        return $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'sku' => 'required|string',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'string',
            'buying_price' => 'nullable|numeric',
            'price' => 'required|numeric',
            'stock' => 'nullable|integer',
            'has_variants' => 'nullable|boolean',
            'has_in_stocks' => 'nullable|boolean',
            'status' => 'nullable|boolean',
            'tax' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
            'is_trending' => 'nullable|boolean',
            'has_discount' => 'nullable|boolean',
            'discount_to' => 'nullable|date',
            'discount_type' => 'nullable|string|in:flat,percentage',
            'discount_amount' => 'nullable|numeric|min:0',
            'variants' => 'nullable|array|required_if:has_variants,1',
        ]);
    }
}
