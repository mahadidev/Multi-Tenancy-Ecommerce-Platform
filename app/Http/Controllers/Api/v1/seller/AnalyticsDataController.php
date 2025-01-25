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
    public function index(Request $request)
    {
        $products_count = Product::authorized()->count() ?? 0;
        $categories_count = Category::authorized()->where('type', 'product')->count() ?? 0;
        $orders_count = Order::authorized()->count() ?? 0;
        $customers_count = User::whereJsonContains('store_id', authStore())->count() ?? 0;

        // Get order analytics if filter or date parameters exist
        if ($request->has(['filter']) || $request->has(['start_date', 'end_date'])) {
            $analyticsResponse = $this->getOrderAnalytics($request);
            $responseData = $analyticsResponse->getData();

            // If there's an error (status 400), return the error response
            if ($analyticsResponse->getStatusCode() === 400) {
                return response()->json([
                    'status' => $responseData->status,
                    'message' => $responseData->message
                ], 400);
            }
        }

        return response()->json([
            'status' => '200',
            'message' => 'Analytics data fetched successfully',
            'data' => [
                'products_count' => $products_count,
                'categories_count' => $categories_count,
                'orders_count' => $orders_count,
                'customers_count' => $customers_count,
                'order_analytics' => $request->has(['filter']) || $request->has(['start_date', 'end_date'])
                    ? $responseData->data
                    : null
            ]
        ], 200);
    }

    public function getOrderAnalytics(Request $request)
    {
        // Check if start_date and end_date exist without filter
        if (($request->has('start_date') || $request->has('end_date')) && !$request->has('filter')) {
            return response()->json([
                'status' => '400',
                'message' => 'filter parameter is required when using start_date and end_date.'
            ], 400);
        }

        $filter = $request->query('filter', 'month');

        // Check if filter is custom and required parameters
        if ($filter === 'custom') {
            if (!$request->has(['start_date', 'end_date'])) {
                return response()->json([
                    'status' => '400',
                    'message' => 'start_date and end_date are required for custom filter.'
                ], 400);
            }

            // Check if dates are valid
            if (!strtotime($request->start_date) || !strtotime($request->end_date)) {
                return response()->json([
                    'status' => '400',
                    'message' => 'start_date and end_date must be valid dates.'
                ], 400);
            }
        }

        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $query = Order::authorized();

        // Determine date range and grouping logic
        $dateRanges = [];
        $groupExpression = null;

        switch ($filter) {
            case 'week':
                $dateRanges = [now()->startOfWeek(), now()->endOfWeek()];
                $groupExpression = 'DATE(created_at)';
                break;

            case 'month':
                $dateRanges = [now()->startOfMonth(), now()->endOfMonth()];
                $groupExpression = 'DATE(created_at)';
                break;

            case 'year':
                $dateRanges = [now()->startOfYear(), now()->endOfYear()];
                $groupExpression = 'CONCAT(YEAR(created_at), "-", MONTH(created_at))';
                break;

            case 'custom':
                $dateRanges = [$startDate, $endDate];
                $groupExpression = 'DATE(created_at)';
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
            ->groupByRaw($groupExpression)
            ->orderByRaw($groupExpression)
            ->get();

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
