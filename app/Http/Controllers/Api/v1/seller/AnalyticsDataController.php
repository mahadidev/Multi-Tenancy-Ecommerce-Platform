<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class AnalyticsDataController extends Controller
{
    public function index()
    {
        $products_count = Product::authorized()->count() ?? 0;
        $categories_count = Category::authorized()->where('type', 'product')->count() ?? 0;
        $orders_count = Order::authorized()->count() ?? 0;
        $customers_count = User::whereJsonContains('store_id', authStore())->count() ?? 0;

        return response()->json([
            'status' => '200',
            'message' => 'Analytics data fetched successfully',
            'data' => [
                'products_count' => $products_count,
                'categories_count' => $categories_count,
                'orders_count' => $orders_count,
                'customers_count' => $customers_count,
            ]
        ], 200);
    }

    public function getOrderAnalytics(Request $request)
{
    // Validate start_date and end_date if provided
    if ($request->has('start_date') && $request->has('end_date')) {
        if (!strtotime($request->start_date) || !strtotime($request->end_date)) {
            return response()->json([
                'status' => '400',
                'message' => 'start_date and end_date must be valid dates.'
            ], 400);
        }
    }

    $filter = $request->query('filter', 'month'); // Default filter is 'month'
    $startDate = $request->query('start_date');
    $endDate = $request->query('end_date');

    $query = Order::authorized(); // Assuming 'authorized' filters by the current seller or store

    // Determine date range and grouping logic
    $dateRanges = [];
    $groupExpression = null;

    switch ($filter) {
        case 'week':
            $dateRanges = [now()->startOfWeek(), now()->endOfWeek()];
            $groupExpression = 'DATE(created_at)'; // Group by day
            break;

        case 'month':
            $dateRanges = [now()->startOfMonth(), now()->endOfMonth()];
            $groupExpression = 'DATE(created_at)'; // Group by day
            break;

        case 'year':
            $dateRanges = [now()->startOfYear(), now()->endOfYear()];
            $groupExpression = 'CONCAT(YEAR(created_at), "-", MONTH(created_at))'; // Group by year and month
            break;

        case 'custom':
            if (!$startDate || !$endDate) {
                return response()->json([
                    'status' => '400',
                    'message' => 'start_date and end_date are required for custom filter.'
                ], 400);
            }
            $dateRanges = [$startDate, $endDate];
            $groupExpression = 'DATE(created_at)'; // Group by day
            break;

        default:
            return response()->json([
                'status' => '400',
                'message' => 'Invalid filter type. Use week, month, year, or custom.'
            ], 400);
    }

    // Apply date range filter
    $filteredQuery = $query->whereBetween('created_at', $dateRanges);

    $totalOrders = $filteredQuery->count();

    // Fetch grouped data
    $orders = $filteredQuery
        ->selectRaw("$groupExpression as date, COUNT(*) as order_count")
        ->groupByRaw($groupExpression) // Use the same expression in groupBy
        ->orderByRaw($groupExpression)
        ->get();

    // Total orders within the date range

    return response()->json([
        'status' => '200',
        'data' => [
            'filter' => $filter,
            'total_orders' => $totalOrders,
            'orders' => $orders
        ]
    ], 200);
}

}
