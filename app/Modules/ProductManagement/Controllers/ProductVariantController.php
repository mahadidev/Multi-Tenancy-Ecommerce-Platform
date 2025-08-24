<?php

namespace App\Modules\ProductManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ProductManagement\Resources\ProductVariantResource;
use App\Modules\ProductManagement\Models\Product;
use App\Modules\ProductManagement\Models\ProductVariant;
use App\Modules\ProductManagement\Services\ProductVariantService;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    protected $productVariantService;

    public function __construct()
    {
        $this->productVariantService = new ProductVariantService();
    }

    public function index(Request $request, $product)
    {
        // Manually resolve the product model to ensure we get the right one
        $productModel = \App\Modules\ProductManagement\Models\Product::findOrFail($product);
        $variants = $productModel->variants;

        $response = [
            'status' => 200,
            'data' => [
                'variants' => ProductVariantResource::collection($variants),
            ],
        ];

        return response()->json($response, 200);
    }

    public function store(Request $request, $product)
    {
        // Manually resolve the product model to ensure we get the right one
        $productModel = \App\Modules\ProductManagement\Models\Product::findOrFail($product);
        
        $variant = $this->productVariantService->createVariant($productModel, $request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Variant created successfully',
            'variant' => [
                'variant' => $variant,
            ],
        ]);

    }

    public function update(Request $request, $product)
    {
        // Manually resolve the product model to ensure we get the right one
        $productModel = \App\Modules\ProductManagement\Models\Product::findOrFail($product);
        $variant = $this->productVariantService->updateVariant($productModel, $request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Variant updated successfully',
            'variant' => [
                'variant' => $variant,
            ],
        ]);

    }

    public function destroy($product, $variant)
    {
        // Manually resolve the models to ensure we get the right ones
        $productModel = \App\Modules\ProductManagement\Models\Product::findOrFail($product);
        $variantModel = \App\Modules\ProductManagement\Models\ProductVariant::findOrFail($variant);
        $variant = $this->productVariantService->deleteVariant($productModel, $variantModel);

        return response()->json([
            'status' => 200,
            'message' => 'Variant updated successfully',
            'variant' => [
                'variant' => $variant,
            ],
        ]);

    }
}
