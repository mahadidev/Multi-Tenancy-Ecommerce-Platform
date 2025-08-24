<?php
namespace App\Modules\InventoryManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\InventoryManagement\Resources\ProductStockResource;
use App\Modules\ProductManagement\Models\Product;
use App\Modules\InventoryManagement\Models\ProductStock;
use App\Modules\InventoryManagement\Services\ProductStockService;
use Illuminate\Http\Request;


class ProductStockController extends Controller
{
    protected $productStockService;

    public function __construct()
    {
        $this->productStockService = new ProductStockService();
    }

    // Display a listing of the product stocks for a product.
    public function index(Request $request, $product)
    {
        // Manually resolve the product model to ensure we get the right one
        $productModel = \App\Modules\ProductManagement\Models\Product::findOrFail($product);
        $stocks = $productModel->stocks;

        $response = [
            'status' => 200,
            'data' => [
                'stocks' => ProductStockResource::collection($stocks),
            ],
        ];

        return response()->json($response, 200);
    }

    // Store a newly created product stock.
    public function store(Request $request, $product)
    {
        // Manually resolve the product model to ensure we get the right one
        $productModel = \App\Modules\ProductManagement\Models\Product::findOrFail($product);
        $stock = $this->productStockService->createStock($productModel, $request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Product stock created successfully',
            'stock' => [
                'stock' => $stock,
            ],
        ]);
    }

    // Update an existing product stock.
    public function update(Request $request, $product)
    {
        // Manually resolve the product model to ensure we get the right one
        $productModel = \App\Modules\ProductManagement\Models\Product::findOrFail($product);
        $stock = $this->productStockService->updateStock($productModel, $request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Product stock updated successfully',
            'stock' => [
                'stock' => $stock,
            ],
        ]);
    }

    // Remove the specified product stock.
    public function destroy($product, $stock)
    {
        // Manually resolve the models to ensure we get the right ones
        $productModel = \App\Modules\ProductManagement\Models\Product::findOrFail($product);
        $stockModel = \App\Modules\InventoryManagement\Models\ProductStock::findOrFail($stock);
        $this->productStockService->deleteStock($productModel, $stockModel->id);

        return response()->json([
            'status' => 200,
            'message' => 'Product stock deleted successfully',
        ]);
    }
}
