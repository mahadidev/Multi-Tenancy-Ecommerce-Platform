<?php

namespace App\Modules\ProductManagement\Services;

use App\Models\Product;
use App\Modules\ProductManagement\Resources\ProductResource;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ProductUpdaterService
{
    protected $productVariantService;

    public function __construct()
    {
        $this->productVariantService = new ProductVariantService();
    }

    public function handle(Request $request, $id)
    {
        $product = Product::with('category', 'store', 'variants', 'brand')->authorized()->find($id);
        if (!$product) {
            return null;
        }

        $validatedData = $this->validate($request);

        $validatedData['sku'] = strval($validatedData['sku'] ?? $product->sku);

        if (!empty($validatedData['discount_amount']) && empty($validatedData['discount_to'])) {
            $validatedData["discount_to"] = Carbon::now()->addYears(10);
        }

        if (!empty($validatedData["discount_amount"]) && !isset($validatedData["has_discount"])) {
            $validatedData["has_discount"] = true;
        }

        $product->update($validatedData);

        return new ProductResource($product->load('variants.options'));
    }

    protected function validate(Request $request)
    {
        return $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'sku' => 'nullable',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'string',
            'price' => 'nullable|numeric',
            'buying_price' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'has_variants' => 'nullable|boolean',
            'has_in_stocks' => 'nullable|boolean',
            'status' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_trending' => 'nullable|boolean',
            'has_discount' => 'nullable|boolean',
            'discount_to' => 'nullable|date',
            'tax' => 'nullable|integer',
            'discount_type' => 'nullable|string|in:flat,percentage',
            'discount_amount' => 'nullable|numeric|min:0',
            // 'variants' => 'nullable|array|required_if:has_variants,1',
        ]);
    }
}
