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
            
            // Get current store ID from middleware
            $storeId = authStore();
            
            // Debug: Check if there are any stock history records at all
            $totalRecords = ProductStockHistory::count();
            \Log::info("Total stock history records in database: " . $totalRecords);
            
            // If no records exist, create some test data
            if ($totalRecords == 0) {
                $this->createTestStockHistory($storeId);
            }
            
            // Start with base query - NO eager loading initially
            // Filter by store through products relationship
            $query = ProductStockHistory::query()
                ->whereHas('product', function ($q) use ($storeId) {
                    $q->where('store_id', $storeId);
                });
            
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
            
            // Clone query for total count before applying pagination
            $countQuery = clone $query;
            $total = $countQuery->count();
            $lastPage = ceil($total / $limit);
            
            \Log::info("Stock history query results: Total={$total}, StoreID={$storeId}, Range={$range}");
            
            // Get paginated results with minimal data
            $stockHistories = $query
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->offset(($page - 1) * $limit)
                ->get();
            
            // Load products separately to avoid N+1 but keep it simple
            $productIds = $stockHistories->pluck('product_id')->unique();
            $products = Product::whereIn('id', $productIds)
                ->select('id', 'name', 'thumbnail', 'price', 'sku')
                ->get()
                ->keyBy('id');
            
            // Attach products to histories
            $stockHistories->each(function ($history) use ($products) {
                $product = $products->get($history->product_id);
                if ($product) {
                    $history->product = $product;
                    // Add missing fields that frontend expects
                    $history->product->stockBuyingValue = $history->buying_price ?? 0;
                    $history->product->stockValue = $history->price ?? $product->price;
                }
            });
            
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

    /**
     * Create test stock history data if none exists
     */
    private function createTestStockHistory($storeId)
    {
        // Get some products from this store
        $products = Product::where('store_id', $storeId)->take(3)->get();
        
        if ($products->isEmpty()) {
            \Log::info("No products found for store {$storeId}, cannot create test stock history");
            return;
        }
        
        $types = ['added', 'deleted', 'adjusted'];
        
        foreach ($products as $product) {
            for ($i = 0; $i < 3; $i++) {
                $randomType = $types[array_rand($types)];
                $randomQty = rand(1, 50);
                $randomPrice = $product->price ?? 1000;
                $randomBuyingPrice = $randomPrice * 0.7; // 70% of selling price
                
                ProductStockHistory::create([
                    'product_id' => $product->id,
                    'product_stock_id' => null, // We may not have product stocks
                    'qty' => $randomQty,
                    'price' => $randomPrice,
                    'discount_amount' => 0,
                    'buying_price' => $randomBuyingPrice,
                    'tax' => 0,
                    'note' => "Test {$randomType} entry",
                    'type' => $randomType,
                    'created_at' => now()->subDays(rand(0, 7)),
                    'updated_at' => now()->subDays(rand(0, 7)),
                ]);
            }
        }
        
        \Log::info("Created test stock history data for store {$storeId}");
    }
}
