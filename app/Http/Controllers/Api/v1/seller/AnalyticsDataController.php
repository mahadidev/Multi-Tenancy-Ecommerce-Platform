<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsDataController extends Controller
{

    public function index(Request $request){
  
        $filter = $request->has('filter') ? $request->query('filter') : 'year';
  
        // Filtered queries
        $orders = Order::authorized()->get();
        $products_count = Product::authorized()->count() ?? 0;
        $categories_count = Category::authorized()->where('type', 'product')->count() ?? 0;
        $orders_count = $orders->count() ?? 0;
        $customers_count = User::whereJsonContains('store_id', authStore())->count() ?? 0;
       
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
                'order_analytics' => $order_analytics
            ]
        ], 200);

    }

    public function getOrderAnalytics($request, $filter = 'year') {
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
    
    
    
    // public function index2(Request $request)
    // {
    //     $orders = Order::authorized()->get();
    //     $products_count = Product::authorized()->count() ?? 0;
    //     $categories_count = Category::authorized()->where('type', 'product')->count() ?? 0;
    //     $orders_count = $orders->count() ?? 0;
    //     $customers_count = User::whereJsonContains('store_id', authStore())->count() ?? 0;
    
    //     //Get order analytics if filter or date parameters exist
    //     if ($request->has(['filter']) || $request->has(['start_date', 'end_date'])) {
    //         $analyticsResponse = $this->getOrderAnalytics($request);
    //         $responseData = $analyticsResponse->getData();

    //         // If there's an error (status 400), return the error response
    //         if ($analyticsResponse->getStatusCode() === 400) {
    //             return response()->json([
    //                 'status' => $responseData->status,
    //                 'message' => $responseData->message
    //             ], 400);
    //         }
    //     }

    //     return response()->json([
    //         'status' => '200',
    //         'message' => 'Analytics data fetched successfully',
    //         'data' => [
    //             'products_count' => $products_count,
    //             'categories_count' => $categories_count,
    //             'orders_count' => $orders_count,
    //             'customers_count' => $customers_count,
    //             'order_analytics' => $request->has(['filter']) || $request->has(['start_date', 'end_date'])
    //                 ? $responseData->data
    //                 : null
    //         ]
    //     ], 200);
    // }

    // public function getOrderAnalytics2(Request $request)
    // {
    //     // Check if start_date and end_date exist without filter
    //     if (($request->has('start_date') || $request->has('end_date')) && !$request->has('filter')) {
    //         return response()->json([
    //             'status' => '400',
    //             'message' => 'filter parameter is required when using start_date and end_date.'
    //         ], 400);
    //     }

    //     $filter = $request->query('filter', 'year');

    //     $startDate = $request->query('start_date') ?? now()->startOfYear();
    //     $endDate = $request->query('end_date') ?? now()->endOfYear();
    //     $query = Order::authorized();


    //     // Get the counts grouped by month for filter: year
    //     $orders = $query->whereBetween('created_at', [$startDate, $endDate])
    //     ->select(DB::raw('MONTH(created_at) as month, COUNT(*) as order_count'))
    //     ->groupBy('month')
    //     ->pluck('order_count', 'month'); // Creates a key-value pair [month => order_count]

    //     // Initialize an array for all 12 months and merge actual counts
    //     $orderCounts = array_values(array_replace(array_fill(1, 12, 0), $orders->toArray()));

    //     return response()->json([
    //         'status' => '200',
    //         'data' => [
    //             'filter' => $filter,
    //             'orders' => $orderCounts
    //         ]
    //     ], 200);
    // }
}
