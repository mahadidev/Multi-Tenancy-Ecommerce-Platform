<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Models\ProductVariantOption;
use App\Services\ProductServices\ProductStockServices\ProductStockHistoryService;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsDataController extends Controller
{
    protected $productStockHistoryService;

    public function __construct() {
        $this->productStockHistoryService = new ProductStockHistoryService;
    }


    public function index(Request $request)
    {

        // Filtered queries
        $orders = Order::authorized()->get();
        $products_count = Product::authorized()->count() ?? 0;
        $categories_count = Category::authorized()->where('type', 'product')->count() ?? 0;
        $orders_count = $orders->count() ?? 0;
        $customers_count = User::whereJsonContains('store_id', authStore())->count() ?? 0;

        // products
        $products = Product::authorized()->get();
        $total = $products->sum(function ($product) {
            return $product->totalStockValue();
        });
        $totalDiscounted = $products->sum(function ($product) {
            return $product->totalDiscountedStockValue();
        });

        // visitors query
        $store = getStore();
        $visitor_count = $store?->visitors() ?? 0;
        $unique_visitor_count = $store?->uniqueVisitors() ?? 0;
        $unique_visitor_today_count = $store?->uniqueVisitorsToday() ?? 0;

        $filter = $request->has('filter') ? $request->query('filter') : 'year';

        // Charts and Graphs data
        $order_analytics = $this->getOrderAnalytics($request, $filter) ?? null;


        return response()->json([
            'status' => '200',
            'message' => 'Analytics data fetched successfully',
            'data' => [
                'products_count' => $products_count,
                'categories_count' => $categories_count,
                'orders_count' => $orders_count,
                'customers_count' => $customers_count,
                'visitor_count' => $visitor_count,
                'unique_visitor_count' => $unique_visitor_count,
                'unique_visitor_today_count' => $unique_visitor_today_count,
                'order_analytics' => $order_analytics,
                'productAnalytics' => $this->productAnalytics(),
                'product' => [
                    'valuation' => [
                        "total" => $total,
                        "totalDiscounted" => $totalDiscounted
                    ],
                    "stock" => [
                        "history" => $this->productStockHistoryService->getStockHistorySummary()
                    ]

                ]
            ]
        ], 200);

    }

    public function getOrderAnalytics($request, $filter = 'year')
    {
        $query = Order::authorized();

        $orderCounts = [];
        $totalRevenue = 0;
        $averageOrderValue = 0;
        $monthlyRevenues = []; // Initialize an array for monthly revenues

        if ($filter == 'year') {
            // Group orders by month and calculate counts and revenue
            $orders = $query
                ->select(DB::raw('MONTH(created_at) as month, COUNT(*) as order_count, SUM(total) as revenue'))
                ->groupBy('month')
                ->get();

            // Initialize counts and revenue for all 12 months
            $orderCounts = array_fill(1, 12, 0);
            $monthlyRevenues = array_fill(1, 12, 0);

            foreach ($orders as $order) {
                $orderCounts[$order->month] = $order->order_count;
                $monthlyRevenues[$order->month] = $order->revenue;
                $totalRevenue += $order->revenue;
            }

            $averageOrderValue = $totalRevenue > 0 ? round($totalRevenue / array_sum($orderCounts), 2) : 0;
        }

        return [
            'total_revenue' => $totalRevenue,
            'average_order_value' => $averageOrderValue,
            'filter' => $filter,
            'orders' => array_values($orderCounts),
            'monthly_revenues' => array_values($monthlyRevenues), // List of revenues for each month
        ];
    }

    public function productAnalytics()
    {
        // Base product count
        $totalProducts = Product::with('variants')->with('variants.options')->get();
        $totalValueation = 0;
        $totalBuyingPrice = 0;

        foreach ($totalProducts as $product) {
            // buying price
            $totalBuyingPrice += $product->buying_price ?? 0;
            if (isset($product->variants)) {

            }
        }

        return $totalBuyingPrice;
    }
}
