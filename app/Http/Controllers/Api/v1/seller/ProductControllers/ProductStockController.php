<?php
namespace App\Http\Controllers\Api\v1\seller\ProductControllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductStockResource;
use App\Models\Product;
use App\Models\ProductStock;
use \App\Services\ProductServices\ProductStockServices\ProductStockService;
use Illuminate\Http\Request;


class ProductStockController extends Controller
{
    protected $productStockService;

    public function __construct()
    {
        $this->productStockService = new ProductStockService();
    }

    // Display a listing of the product stocks for a product.
    public function index(Request $request, Product $product)
    {
        $stocks = $product->stocks;

        $response = [
            'status' => 200,
            'data' => [
                'stocks' => ProductStockResource::collection($stocks),
            ],
        ];

        return response()->json($response, 200);
    }

    // Store a newly created product stock.
    public function store(Request $request, Product $product)
    {
        $stock = $this->productStockService->createStock($product, $request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Product stock created successfully',
            'stock' => [
                'stock' => $stock,
            ],
        ]);
    }

    // Update an existing product stock.
    public function update(Request $request, Product $product)
    {
        $stock = $this->productStockService->updateStock($product, $request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Product stock updated successfully',
            'stock' => [
                'stock' => $stock,
            ],
        ]);
    }

    // Remove the specified product stock.
    public function destroy(Product $product, ProductStock $stock)
    {
        $this->productStockService->deleteStock($product, $stock->id);

        return response()->json([
            'status' => 200,
            'message' => 'Product stock deleted successfully',
        ]);
    }
}
