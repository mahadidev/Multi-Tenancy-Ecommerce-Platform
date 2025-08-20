<?php
/*
 * EMERGENCY PATCH FOR ProductStockHistoryController
 * Replace the index() method in app/Modules/InventoryManagement/Controllers/ProductStockHistoryController.php
 * This will fix the immediate timeout issue
 */

// Replace the entire index() method with this code:

// public function index(Request $request)
{
    try {
        // Set memory and time limits
        ini_set('memory_limit', '512M');
        set_time_limit(60);
        
        // Get parameters
        $range = $request->input('range', 'week');
        $limit = min((int)$request->input('limit', 10), 50); // Cap at 50 to prevent overload
        $page = (int)$request->input('page', 1);
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        // Build optimized query - DIRECT on ProductStockHistory, not through Product
        $query = ProductStockHistory::query()
            ->select('product_stock_histories.*') // Only select what we need
            ->join('products', 'product_stock_histories.product_id', '=', 'products.id')
            ->where('products.store_id', auth()->user()->store_id); // Only current store

        // Apply date filtering FIRST to reduce dataset
        if ($range === 'custom' && $startDate && $endDate) {
            $query->whereBetween('product_stock_histories.created_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ]);
        } else {
            switch ($range) {
                case 'today':
                    $query->whereDate('product_stock_histories.created_at', Carbon::today());
                    break;
                case 'week':
                    $query->where('product_stock_histories.created_at', '>=', Carbon::now()->subDays(6)->startOfDay());
                    break;
                case 'month':
                    $query->where('product_stock_histories.created_at', '>=', Carbon::now()->subDays(29)->startOfDay());
                    break;
                case 'year':
                    $query->where('product_stock_histories.created_at', '>=', Carbon::now()->subYear()->startOfDay());
                    break;
            }
        }

        // Use database-level ordering and pagination
        $stockHistories = $query
            ->orderBy('product_stock_histories.created_at', 'desc')
            ->with(['product:id,name,thumbnail,stockBuyingValue,stockValue']) // Only load needed fields
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
        
    } catch (\Exception $e) {
        // Fallback error response
        return response()->json([
            'status' => 500,
            'message' => 'Database query timeout. Please contact administrator to optimize database.',
            'error' => $e->getMessage(),
            'data' => ['histories' => []]
        ], 500);
    }
}