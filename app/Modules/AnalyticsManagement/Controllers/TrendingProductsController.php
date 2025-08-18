<?php

namespace App\Modules\AnalyticsManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\AnalyticsManagement\Services\TrendingProductsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TrendingProductsController extends Controller
{
    protected TrendingProductsService $trendingProductsService;

    public function __construct(TrendingProductsService $trendingProductsService)
    {
        $this->trendingProductsService = $trendingProductsService;
    }

    public function getTrendingProducts(Request $request): JsonResponse
    {
        $request->validate([
            'filter_type' => 'required|in:top_selling,most_revenue,most_profitable,recently_popular',
            'time_range' => 'required|in:today,last7days,last30days,last1year',
            'limit' => 'nullable|integer|min:1|max:50',
            'page' => 'nullable|integer|min:1'
        ]);

        $filterType = $request->input('filter_type');
        $timeRange = $request->input('time_range');
        $limit = $request->input('limit', 8);
        $page = $request->input('page', 1);

        $result = $this->trendingProductsService->getTrendingProducts(
            $filterType,
            $timeRange,
            $limit,
            $page
        );

        return response()->json([
            'success' => true,
            'products' => $result['products'],
            'total' => $result['total'],
            'period' => $result['period'],
            'filter_type' => $filterType,
            'current_page' => $page,
            'per_page' => $limit,
            'has_more' => $result['has_more']
        ]);
    }
}