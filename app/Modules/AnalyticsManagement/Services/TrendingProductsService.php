<?php

namespace App\Modules\AnalyticsManagement\Services;

use App\Modules\OrderManagement\Models\OrderItem;
use App\Modules\ProductManagement\Models\Product;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TrendingProductsService
{
    public function getTrendingProducts(string $filterType, string $timeRange, int $limit = 8, int $page = 1): array
    {
        $offset = ($page - 1) * $limit;
        $dateRange = $this->getDateRange($timeRange);
        
        // Get the authenticated user's store
        $user = auth()->user();
        $storeId = null;
        
        if ($user) {
            // Check if user has a store session
            $storeSession = \App\Modules\StoreManagement\Models\StoreSession::where('user_id', $user->id)->first();
            if ($storeSession) {
                $storeId = $storeSession->store_id;
            } else {
                // Check if user owns a store
                $store = \App\Modules\StoreManagement\Models\Store::where('owner_id', $user->id)->first();
                if ($store) {
                    $storeId = $store->id;
                }
            }
        }
        
        $query = OrderItem::query()
            ->select([
                'product_id',
                DB::raw('SUM(qty) as total_quantity'),
                DB::raw('SUM(price * qty) as total_revenue'),
                DB::raw('COUNT(*) as order_count')
            ])
            ->with(['product:id,name,thumbnail']);
            
        // Filter by store if available
        if ($storeId) {
            $query->where('store_id', $storeId);
        }
        
        $query->whereHas('order', function ($query) use ($dateRange) {
                $query->where('created_at', '>=', $dateRange['start'])
                      ->where('created_at', '<=', $dateRange['end'])
                      ->where('status', '!=', 'cancelled');
            })
            ->groupBy('product_id');

        // Get total count for pagination BEFORE applying ordering
        $countQuery = clone $query;
        $total = $countQuery->get()->count();

        // Apply sorting based on filter type using raw expressions instead of aliases
        switch ($filterType) {
            case 'most_revenue':
                $query->orderBy(DB::raw('SUM(price * qty)'), 'desc');
                break;
            case 'most_profitable':
                // Assuming 30% profit margin for simplicity
                $query->orderBy(DB::raw('SUM(price * qty) * 0.3'), 'desc');
                break;
            case 'recently_popular':
                $query->orderBy(DB::raw('COUNT(*)'), 'desc')
                      ->orderBy(DB::raw('SUM(qty)'), 'desc');
                break;
            case 'top_selling':
            default:
                $query->orderBy(DB::raw('SUM(qty)'), 'desc');
                break;
        }

        // Apply pagination
        $products = $query->offset($offset)
                         ->limit($limit)
                         ->get();

        // Transform the data
        $transformedProducts = $products->map(function ($item) {
            // Keep thumbnail as null if product doesn't have one
            // Frontend will handle placeholder display
            return [
                'product_id' => $item->product_id,
                'total_quantity' => (int) $item->total_quantity,
                'total_revenue' => (float) $item->total_revenue,
                'order_count' => (int) $item->order_count,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'thumbnail' => $item->product->thumbnail
                ]
            ];
        });

        return [
            'products' => $transformedProducts,
            'total' => $total,
            'period' => $this->getPeriodLabel($timeRange),
            'has_more' => ($offset + $limit) < $total
        ];
    }

    private function getDateRange(string $timeRange): array
    {
        $now = Carbon::now();
        
        switch ($timeRange) {
            case 'today':
                return [
                    'start' => $now->copy()->startOfDay(),
                    'end' => $now->copy()->endOfDay()
                ];
            case 'last7days':
                return [
                    'start' => $now->copy()->subDays(7)->startOfDay(),
                    'end' => $now->copy()->endOfDay()
                ];
            case 'last30days':
                return [
                    'start' => $now->copy()->subDays(30)->startOfDay(),
                    'end' => $now->copy()->endOfDay()
                ];
            case 'last1year':
                return [
                    'start' => $now->copy()->subYear()->startOfDay(),
                    'end' => $now->copy()->endOfDay()
                ];
            default:
                return [
                    'start' => $now->copy()->subDays(7)->startOfDay(),
                    'end' => $now->copy()->endOfDay()
                ];
        }
    }

    private function getPeriodLabel(string $timeRange): string
    {
        switch ($timeRange) {
            case 'today':
                return 'Today';
            case 'last7days':
                return 'Last 7 Days';
            case 'last30days':
                return 'Last 30 Days';
            case 'last1year':
                return 'Last Year';
            default:
                return 'Last 7 Days';
        }
    }
}