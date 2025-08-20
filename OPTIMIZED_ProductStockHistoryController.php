<?php
namespace App\Modules\InventoryManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductStockHistoryResource;
use App\Modules\InventoryManagement\Models\ProductStockHistory;
use App\Modules\InventoryManagement\Services\ProductStockHistoryService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ProductStockHistoryController extends Controller
{
    protected $productStockHistoryService;

    public function __construct()
    {
        $this->productStockHistoryService = new ProductStockHistoryService();
    }

    public function index(Request $request)
    {
        // Get parameters from request
        $range = $request->input('range', 'week');
        $limit = $request->input('limit', 20);
        $page = $request->input('page', 1);
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Build optimized query
        $query = ProductStockHistory::with(['product' => function($query) {
            // Only load authorized products
            $query->authorized();
        }]);

        // Apply date filtering based on range
        if ($range === 'custom' && $startDate && $endDate) {
            $query->whereBetween('created_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ]);
        } else {
            switch ($range) {
                case 'today':
                    $query->whereDate('created_at', Carbon::today());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [
                        Carbon::now()->subDays(6)->startOfDay(),
                        Carbon::now()->endOfDay()
                    ]);
                    break;
                case 'month':
                    $query->whereBetween('created_at', [
                        Carbon::now()->subDays(29)->startOfDay(),
                        Carbon::now()->endOfDay()
                    ]);
                    break;
                case 'year':
                    $query->whereBetween('created_at', [
                        Carbon::now()->subYear()->startOfDay(),
                        Carbon::now()->endOfDay()
                    ]);
                    break;
            }
        }

        // Apply ordering and pagination at database level
        $stockHistories = $query
            ->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);

        $response = [
            'status' => 200,
            'data' => [
                'histories' => ProductStockHistoryResource::collection($stockHistories->items()),
            ],
            'meta' => [
                'current_page' => $stockHistories->currentPage(),
                'first_page_url' => $stockHistories->url(1),
                'last_page' => $stockHistories->lastPage(),
                'last_page_url' => $stockHistories->url($stockHistories->lastPage()),
                'next_page_url' => $stockHistories->nextPageUrl(),
                'prev_page_url' => $stockHistories->previousPageUrl(),
                'total' => $stockHistories->total(),
                'per_page' => $stockHistories->perPage(),
            ]
        ];

        return response()->json($response, 200);
    }

    // Keep other methods unchanged...
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

    public function productHistory(Request $request, Product $product)
    {
        return 1;
    }
}