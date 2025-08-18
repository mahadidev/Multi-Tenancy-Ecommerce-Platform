<?php

namespace App\Modules\AnalyticsManagement\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\OrderManagement\Services\OrderService;
use Illuminate\Support\Facades\Log;

class SalesChartController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Get sales chart data - dedicated endpoint for chart visualization only
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function chart(Request $request)
    {
        try {
            $request->validate([
                'period' => 'sometimes|in:today,last7days,last30days,last1year,custom',
                'start_date' => 'required_if:period,custom|date',
                'end_date' => 'required_if:period,custom|date',
            ]);

            $period = $request->input('period', 'last7days');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            // Get full report but only return chart-specific data
            $fullReport = $this->orderService->getOrderReport($period, $startDate, $endDate);
            
            // Debug: Log what we received from OrderService
            $chartSeriesFromService = $fullReport['chartSeries'] ?? [];
            Log::info('OrderService returned data', [
                'period_requested' => $period,
                'period_returned' => $fullReport['period'] ?? 'not_set',
                'chartSeries_keys' => $chartSeriesFromService instanceof \Illuminate\Support\Collection 
                    ? $chartSeriesFromService->keys()->toArray() 
                    : array_keys($chartSeriesFromService),
                'chartSeries_count' => $chartSeriesFromService instanceof \Illuminate\Support\Collection 
                    ? $chartSeriesFromService->count() 
                    : count($chartSeriesFromService),
                'chartSeries_type' => gettype($chartSeriesFromService)
            ]);
            
            // Extract ONLY chart visualization data and optimize product data
            $chartSeries = $fullReport['chartSeries'] ?? [];
            
            // Ensure we're working with a Collection
            $chartSeriesCollection = $chartSeries instanceof \Illuminate\Support\Collection 
                ? $chartSeries 
                : collect($chartSeries);
            
            // Transform chartSeries to include only essential product data (name, price)
            $optimizedChartSeries = $chartSeriesCollection->map(function ($seriesData) {
                $optimizedData = [
                    'order_count' => $seriesData['order_count'] ?? 0,
                    'revenue' => $seriesData['revenue'] ?? 0,
                    'profit' => $seriesData['profit'] ?? 0,
                    'product_qty' => $seriesData['product_qty'] ?? 0,
                ];

                // Only include minimal product data if products exist
                if (isset($seriesData['products']) && is_array($seriesData['products'])) {
                    $optimizedData['products'] = collect($seriesData['products'])->map(fn($product) => [
                        'name' => $product['name'] ?? 'Unknown Product',
                        'price' => $product['price'] ?? 0,
                    ])->toArray();
                }

                return $optimizedData;
            })->toArray();

            $chartData = [
                'chartSeries' => $optimizedChartSeries,
                'period' => $fullReport['period'] ?? $period,
                'total_revenue' => $fullReport['total_revenue'] ?? 0,
                'total_profit' => $fullReport['total_profit'] ?? 0,
                'total_orders' => $fullReport['total_orders'] ?? 0,
            ];

            Log::info('Sales Chart API called', [
                'period' => $period,
                'requested_period' => $request->input('period'),
                'endpoint' => '/sales/chart',
                'data_size' => count($chartData['chartSeries'] ?? []),
                'chart_series_keys' => array_keys($chartData['chartSeries'] ?? []),
                'optimized_keys' => array_keys($optimizedChartSeries)
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Sales chart data retrieved successfully',
                'data' => ['chart' => $chartData],
            ]);

        } catch (\Exception $e) {
            Log::error('Sales chart error: ' . $e->getMessage(), [
                'period' => $request->input('period'),
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve sales chart data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales metrics summary - lightweight metrics only
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function metrics(Request $request)
    {
        try {
            $request->validate([
                'period' => 'sometimes|in:today,last7days,last30days,last1year,custom',
                'start_date' => 'required_if:period,custom|date',
                'end_date' => 'required_if:period,custom|date',
            ]);

            $period = $request->input('period', 'last7days');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            // Get full report but only return metrics
            $fullReport = $this->orderService->getOrderReport($period, $startDate, $endDate);
            
            // Extract only metrics data
            $metricsData = [
                'total_revenue' => $fullReport['total_revenue'] ?? 0,
                'total_profit' => $fullReport['total_profit'] ?? 0,
                'total_orders' => $fullReport['total_orders'] ?? 0,
                'paid_revenue' => $fullReport['paid_revenue'] ?? 0,
                'pending_revenue' => $fullReport['pending_revenue'] ?? 0,
                'period' => $fullReport['period'] ?? $period,
                // Calculate growth if previous period data exists
                'growth_percentage' => $this->calculateGrowth($fullReport),
            ];

            Log::info('Sales Metrics API called', [
                'period' => $period,
                'endpoint' => '/sales/metrics'
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Sales metrics retrieved successfully',
                'data' => ['metrics' => $metricsData],
            ]);

        } catch (\Exception $e) {
            Log::error('Sales metrics error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve sales metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sales trends and daily trends - dedicated endpoint for trend analysis
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function trends(Request $request)
    {
        try {
            $request->validate([
                'period' => 'sometimes|in:today,last7days,last30days,last1year,custom',
                'compare' => 'sometimes|boolean',
                'start_date' => 'required_if:period,custom|date',
                'end_date' => 'required_if:period,custom|date',
            ]);

            $period = $request->input('period', 'last7days');
            $compare = $request->boolean('compare', false);
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            // Get current period data
            $currentReport = $this->orderService->getOrderReport($period, $startDate, $endDate);
            
            $trendsData = [
                'period' => $period,
                'daily_trends' => $currentReport['daily_trends'] ?? [],
                'top_products' => $currentReport['top_products'] ?? [],
                'current_period' => [
                    'revenue' => $currentReport['total_revenue'] ?? 0,
                    'orders' => $currentReport['total_orders'] ?? 0,
                    'profit' => $currentReport['total_profit'] ?? 0,
                ],
            ];

            // If comparison is requested, get previous period
            if ($compare) {
                // TODO: Implement previous period comparison logic
                $trendsData['previous_period'] = [
                    'period' => "previous_{$period}",
                    'revenue' => 0,
                    'orders' => 0,
                    'profit' => 0,
                ];
                $trendsData['growth_comparison'] = [
                    'revenue_growth' => 0,
                    'orders_growth' => 0,
                    'profit_growth' => 0,
                ];
            }

            Log::info('Sales Trends API called', [
                'period' => $period,
                'compare' => $compare,
                'endpoint' => '/sales/trends',
                'daily_trends_count' => count($trendsData['daily_trends'])
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Sales trends retrieved successfully',
                'data' => ['trends' => $trendsData],
            ]);

        } catch (\Exception $e) {
            Log::error('Sales trends error: ' . $e->getMessage());

            return response()->json([
                'status' => 500,
                'message' => 'Failed to retrieve sales trends',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate growth percentage from report data
     * 
     * @param array $report
     * @return float
     */
    private function calculateGrowth(array $report): float
    {
        $chartSeries = $report['chartSeries'] ?? [];
        
        if (count($chartSeries) < 2) {
            return 0.0;
        }

        $values = array_values($chartSeries);
        $current = $values[count($values) - 1]['revenue'] ?? 0;
        $previous = $values[count($values) - 2]['revenue'] ?? 0;

        if ($previous == 0) {
            return 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 2);
    }
}