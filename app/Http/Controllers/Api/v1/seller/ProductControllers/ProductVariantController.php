<?php

namespace App\Http\Controllers\Api\v1\seller\ProductControllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductVariantResource;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\ProductServices\ProductVariantService;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    protected $productVariantService;

    public function __construct()
    {
        $this->productVariantService = new ProductVariantService();
    }

    public function index(Request $request, Product $product)
    {
        $variants = $product->variants;

        $response = [
            'status' => 200,
            'data' => [
                'variants' => ProductVariantResource::collection($variants),
            ],
        ];

        return response()->json($response, 200);
    }

    public function store(Request $request, Product $product)
    {
        $variant = $this->productVariantService->createVariant($product, $request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Variant created successfully',
            'variant' => [
                'variant' => $variant,
            ],
        ]);

    }

    public function update(Request $request, Product $product)
    {
        $variant = $this->productVariantService->updateVariant($product, $request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Variant updated successfully',
            'variant' => [
                'variant' => $variant,
            ],
        ]);

    }

    public function destroy(Product $product, ProductVariant $variant)
    {
        $variant = $this->productVariantService->deleteVariant($product, $variant);

        return response()->json([
            'status' => 200,
            'message' => 'Variant updated successfully',
            'variant' => [
                'variant' => $variant,
            ],
        ]);

    }
}
