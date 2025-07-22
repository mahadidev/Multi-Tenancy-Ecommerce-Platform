<?php
namespace App\Http\Controllers\Api\v1\seller\ProductControllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductStockResource;
use App\Models\Product;
use App\Models\ProductStockHistory;
use App\Services\ProductServices\ProductStockServices\ProductStockHistoryService;
use Illuminate\Http\Request;


class ProductStockHistoryController extends Controller
{
    protected $productStockHistoryService;

    public function __construct()
    {
        $this->productStockHistoryService = new ProductStockHistoryService();
    }

    // analytics summary
    public function productsHistory(Request $request, Product $product)
    {
        $range = $request->input('range', 'today');

        try {
            $reportData = $this->productStockHistoryService->getStockHistorySummary($range);

            return response()->json([
                'status' => 200,
                'data' => [
                    'history' => $reportData,
                ],
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'status' => 400,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    public function productHistory(Request $request, Product $product){
        return 1;
    }
}
