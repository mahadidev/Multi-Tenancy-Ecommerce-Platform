<?php

namespace App\Modules\AnalyticsManagement\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Get dashboard analytics data
     */
    public function index(Request $request)
    {
        $request->validate([
            'filter' => 'in:today,week,month,year,custom',
            'start_date' => 'date',
            'end_date' => 'date|after_or_equal:start_date', // Allows same-day date ranges
        ]);

        // Get store_id from request or use authStore() helper
        $storeId = $request->get('store_id') ?? authStore();
        $filter = $request->get('filter', 'month');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        
        // If no store_id is available, return error
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store ID is required for analytics'
            ], 400);
        }

        // Set date range based on filter
        if ($filter === 'custom') {
            // For custom filter, use provided dates or default to today if missing
            $startDate = $startDate ? Carbon::parse($startDate)->startOfDay() : Carbon::today()->startOfDay();
            $endDate = $endDate ? Carbon::parse($endDate)->endOfDay() : Carbon::today()->endOfDay();
        } elseif (!$startDate || !$endDate) {
            switch ($filter) {
                case 'today':
                    $startDate = Carbon::today();
                    $endDate = Carbon::today()->endOfDay();
                    break;
                case 'week':
                    $startDate = Carbon::now()->startOfWeek();
                    $endDate = Carbon::now()->endOfWeek();
                    break;
                case 'month':
                    $startDate = Carbon::now()->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
                    break;
                case 'year':
                    $startDate = Carbon::now()->startOfYear();
                    $endDate = Carbon::now()->endOfYear();
                    break;
                default:
                    $startDate = Carbon::now()->startOfMonth();
                    $endDate = Carbon::now()->endOfMonth();
            }
        } else {
            // Parse provided dates
            $startDate = Carbon::parse($startDate)->startOfDay();
            $endDate = Carbon::parse($endDate)->endOfDay();
        }

        // Get counts
        $productsCount = DB::table('products')
            ->where('store_id', $storeId)
            ->count();

        $categoriesCount = DB::table('categories')
            ->where('store_id', $storeId)
            ->count();

        $ordersCount = DB::table('orders')
            ->where('store_id', $storeId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $customersCount = DB::table('users')
            ->whereJsonContains('store_id', $storeId)
            ->count();

        // Get visitor counts
        $visitorCount = DB::table('store_visitors')
            ->where('store_id', $storeId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $uniqueVisitorCount = DB::table('store_visitors')
            ->where('store_id', $storeId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->distinct('ip_address')
            ->count('ip_address');

        $uniqueVisitorTodayCount = DB::table('store_visitors')
            ->where('store_id', $storeId)
            ->whereDate('created_at', Carbon::today())
            ->distinct('ip_address')
            ->count('ip_address');

        // Get order analytics
        $orders = DB::table('orders')
            ->where('store_id', $storeId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select('id', 'total', 'created_at')
            ->get();

        $totalRevenue = $orders->sum('total');
        $averageOrderValue = $ordersCount > 0 ? $totalRevenue / $ordersCount : 0;

        // Get monthly revenues for the period
        $monthlyRevenues = DB::table('orders')
            ->where('store_id', $storeId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(total) as revenue')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::create($item->year, $item->month, 1)->format('M Y'),
                    'revenue' => (float) $item->revenue,
                ];
            });

        // Get product valuation
        $productValuation = DB::table('products')
            ->where('store_id', $storeId)
            ->selectRaw('SUM(price * IFNULL(stock, 0)) as total, SUM((price - IFNULL(discount_amount, 0)) * IFNULL(stock, 0)) as totalDiscounted')
            ->first();

        return response()->json([
            'status' => 200,
            'data' => [
                'products_count' => $productsCount,
                'categories_count' => $categoriesCount,
                'orders_count' => $ordersCount,
                'customers_count' => $customersCount,
                'visitor_count' => $visitorCount,
                'unique_visitor_count' => $uniqueVisitorCount,
                'unique_visitor_today_count' => $uniqueVisitorTodayCount,
                'order_analytics' => [
                    'total_revenue' => $totalRevenue,
                    'average_order_value' => round($averageOrderValue, 2),
                    'filter' => $filter,
                    'orders' => [],
                    'monthly_revenues' => $monthlyRevenues,
                ],
                'productAnalytics' => $productsCount,
                'product' => [
                    'valuation' => [
                        'total' => (float) ($productValuation->total ?? 0),
                        'totalDiscounted' => (float) ($productValuation->totalDiscounted ?? 0),
                    ],
                ],
            ],
        ]);
    }
}