<?php
namespace App\Modules\InventoryManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\InventoryManagement\Resources\ProductStockHistoryResource;
use App\Modules\InventoryManagement\Resources\ProductStockResource;
use App\Modules\ProductManagement\Models\Product;
use App\Modules\InventoryManagement\Models\ProductStockHistory;
use App\Modules\InventoryManagement\Services\ProductStockHistoryService;
use Illuminate\Http\Request;


class ProductStockHistoryController extends Controller
{
    protected $productStockHistoryService;

    public function __construct()
    {
        $this->productStockHistoryService = new ProductStockHistoryService();
    }

    public function index(Request $request)
    {
        // Set memory and time limits
        ini_set('memory_limit', '256M');
        set_time_limit(30);
        
        try {
            // Get parameters
            $range = $request->input('range', 'week');
            $limit = min((int)$request->input('limit', 10), 20); // Small limit
            $page = (int)$request->input('page', 1);
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            
            // Start with base query - NO eager loading initially
            $query = ProductStockHistory::query();
            
            // Apply date filter to reduce dataset FIRST
            if ($range === 'custom' && $startDate && $endDate) {
                // Handle custom date range
                $query->whereBetween('created_at', [
                    $startDate . ' 00:00:00',
                    $endDate . ' 23:59:59'
                ]);
            } else {
                // Handle predefined ranges
                switch ($range) {
                    case 'today':
                        $query->whereDate('created_at', now()->format('Y-m-d'));
                        break;
                    case 'week':
                        $query->where('created_at', '>=', now()->subDays(6)->startOfDay());
                        break;
                    case 'month':
                        $query->where('created_at', '>=', now()->subDays(29)->startOfDay());
                        break;
                    case 'year':
                        $query->where('created_at', '>=', now()->subYear()->startOfDay());
                        break;
                    default:
                        $query->where('created_at', '>=', now()->subDays(6)->startOfDay());
                        break;
                }
            }
            
            // Get paginated results with minimal data
            $stockHistories = $query
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->offset(($page - 1) * $limit)
                ->get();
            
            // Load products separately to avoid N+1 but keep it simple
            $productIds = $stockHistories->pluck('product_id')->unique();
            $products = Product::whereIn('id', $productIds)
                ->select('id', 'name', 'thumbnail')
                ->get()
                ->keyBy('id');
            
            // Attach products to histories
            $stockHistories->each(function ($history) use ($products) {
                $history->product = $products->get($history->product_id);
            });
            
            // Simple count for pagination
            $total = $query->count();
            $lastPage = ceil($total / $limit);
            
            $response = [
                'status' => 200,
                'data' => [
                    'histories' => ProductStockHistoryResource::collection($stockHistories),
                ],
                'meta' => [
                    'current_page' => $page,
                    'first_page_url' => '',
                    'last_page' => $lastPage,
                    'last_page_url' => '',
                    'next_page_url' => $page < $lastPage ? '' : null,
                    'prev_page_url' => $page > 1 ? '' : null,
                    'total' => $total,
                    'per_page' => $limit,
                ]
            ];

            return response()->json($response, 200);
            
        } catch (\Exception $e) {
            // Return error for debugging
            return response()->json([
                'status' => 500,
                'message' => 'Query failed: ' . $e->getMessage(),
                'data' => ['histories' => []],
                'meta' => null
            ], 500);
        }
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
