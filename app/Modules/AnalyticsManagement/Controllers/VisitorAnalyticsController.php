<?php

namespace App\Modules\AnalyticsManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\AnalyticsManagement\Models\StoreVisitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VisitorAnalyticsController extends Controller
{
    /**
     * Get visitor analytics overview
     */
    public function index(Request $request)
    {
        $request->validate([
            'filter' => 'in:today,week,month,year,custom',
            'start_date' => 'date',
            'end_date' => 'date|after_or_equal:start_date',
        ]);

        $storeId = authStore();
        if (!$storeId) {
            return response()->json(['status' => 400, 'message' => 'Store ID required'], 400);
        }

        $filter = $request->get('filter', 'month');
        [$startDate, $endDate] = $this->getDateRange($request, $filter);

        // Basic visitor metrics
        $totalVisitors = StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->count();

        $uniqueVisitors = StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->distinct('ip_address')
            ->count('ip_address');

        $todayVisitors = StoreVisitor::forStore($storeId)->today()->count();
        $todayUniqueVisitors = StoreVisitor::forStore($storeId)->today()->unique()->count();

        // Page views analytics
        $pageViews = $this->getPageViewsAnalytics($storeId, $startDate, $endDate);
        
        // Device analytics
        $deviceAnalytics = $this->getDeviceAnalytics($storeId, $startDate, $endDate);
        
        // Browser analytics  
        $browserAnalytics = $this->getBrowserAnalytics($storeId, $startDate, $endDate);
        
        // Geographic analytics
        $geoAnalytics = $this->getGeographicAnalytics($storeId, $startDate, $endDate);
        
        // Traffic sources
        $trafficSources = $this->getTrafficSources($storeId, $startDate, $endDate);
        
        // Hourly distribution
        $hourlyDistribution = $this->getHourlyDistribution($storeId, $startDate, $endDate);
        
        // Daily trend
        $dailyTrend = $this->getDailyTrend($storeId, $startDate, $endDate);

        return response()->json([
            'status' => 200,
            'data' => [
                'overview' => [
                    'total_visitors' => $totalVisitors,
                    'unique_visitors' => $uniqueVisitors,
                    'today_visitors' => $todayVisitors,
                    'today_unique_visitors' => $todayUniqueVisitors,
                    'bounce_rate' => $this->calculateBounceRate($storeId, $startDate, $endDate),
                    'avg_session_duration' => $this->getAverageSessionDuration($storeId, $startDate, $endDate),
                ],
                'page_views' => $pageViews,
                'device_analytics' => $deviceAnalytics,
                'browser_analytics' => $browserAnalytics,
                'geographic_analytics' => $geoAnalytics,
                'traffic_sources' => $trafficSources,
                'hourly_distribution' => $hourlyDistribution,
                'daily_trend' => $dailyTrend,
                'filter' => $filter,
                'date_range' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                ]
            ]
        ]);
    }

    /**
     * Get real-time visitor data
     */
    public function realTime(Request $request)
    {
        $storeId = authStore();
        if (!$storeId) {
            return response()->json(['status' => 400, 'message' => 'Store ID required'], 400);
        }

        // Get visitors from last 30 minutes
        $thirtyMinutesAgo = Carbon::now()->subMinutes(30);
        
        $realtimeVisitors = StoreVisitor::forStore($storeId)
            ->where('created_at', '>=', $thirtyMinutesAgo)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($visitor) {
                return [
                    'id' => $visitor->id,
                    'page_url' => $visitor->page_url,
                    'country' => $visitor->country,
                    'city' => $visitor->city,
                    'device_type' => $visitor->device_type,
                    'browser' => $visitor->browser,
                    'referer' => $visitor->referer,
                    'time_ago' => $visitor->created_at->diffForHumans(),
                    'created_at' => $visitor->created_at->toISOString(),
                ];
            });

        $activeVisitorsCount = StoreVisitor::forStore($storeId)
            ->where('created_at', '>=', $thirtyMinutesAgo)
            ->distinct('ip_address')
            ->count('ip_address');

        return response()->json([
            'status' => 200,
            'data' => [
                'active_visitors' => $activeVisitorsCount,
                'recent_visitors' => $realtimeVisitors,
                'last_updated' => now()->toISOString(),
            ]
        ]);
    }

    /**
     * Get detailed visitor list
     */
    public function visitors(Request $request)
    {
        $request->validate([
            'page' => 'integer|min:1',
            'per_page' => 'integer|min:1|max:100',
            'search' => 'string|max:255',
            'device_type' => 'string',
            'browser' => 'string',
            'country' => 'string',
        ]);

        $storeId = authStore();
        if (!$storeId) {
            return response()->json(['status' => 400, 'message' => 'Store ID required'], 400);
        }

        $perPage = $request->get('per_page', 20);
        $search = $request->get('search');

        $query = StoreVisitor::forStore($storeId)->with('store');

        // Apply filters
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'like', "%{$search}%")
                  ->orWhere('page_url', 'like', "%{$search}%")
                  ->orWhere('referer', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if ($request->has('device_type')) {
            $query->where('device_type', $request->get('device_type'));
        }

        if ($request->has('browser')) {
            $query->where('browser', $request->get('browser'));
        }

        if ($request->has('country')) {
            $query->where('country', $request->get('country'));
        }

        $visitors = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => 200,
            'data' => $visitors
        ]);
    }

    /**
     * Get date range based on filter
     */
    private function getDateRange(Request $request, string $filter): array
    {
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        if ($filter === 'custom' && $startDate && $endDate) {
            return [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ];
        }

        switch ($filter) {
            case 'today':
                return [Carbon::today(), Carbon::today()->endOfDay()];
            case 'week':
                return [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()];
            case 'month':
                return [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()];
            case 'year':
                return [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()];
            default:
                return [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()];
        }
    }

    /**
     * Get page views analytics
     */
    private function getPageViewsAnalytics(int $storeId, Carbon $startDate, Carbon $endDate): array
    {
        return StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->whereNotNull('page_url')
            ->select('page_url', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT ip_address) as unique_views'))
            ->groupBy('page_url')
            ->orderBy('views', 'desc')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * Get device analytics
     */
    private function getDeviceAnalytics(int $storeId, Carbon $startDate, Carbon $endDate): array
    {
        return StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->whereNotNull('device_type')
            ->select('device_type', DB::raw('COUNT(*) as count'), DB::raw('COUNT(DISTINCT ip_address) as unique_count'))
            ->groupBy('device_type')
            ->orderBy('count', 'desc')
            ->get()
            ->toArray();
    }

    /**
     * Get browser analytics
     */
    private function getBrowserAnalytics(int $storeId, Carbon $startDate, Carbon $endDate): array
    {
        return StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->whereNotNull('browser')
            ->select('browser', DB::raw('COUNT(*) as count'), DB::raw('COUNT(DISTINCT ip_address) as unique_count'))
            ->groupBy('browser')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * Get geographic analytics
     */
    private function getGeographicAnalytics(int $storeId, Carbon $startDate, Carbon $endDate): array
    {
        $countries = StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->whereNotNull('country')
            ->select('country', DB::raw('COUNT(*) as count'), DB::raw('COUNT(DISTINCT ip_address) as unique_count'))
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->toArray();

        $cities = StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->whereNotNull('city')
            ->select('city', 'country', DB::raw('COUNT(*) as count'))
            ->groupBy('city', 'country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->toArray();

        return [
            'countries' => $countries,
            'cities' => $cities
        ];
    }

    /**
     * Get traffic sources
     */
    private function getTrafficSources(int $storeId, Carbon $startDate, Carbon $endDate): array
    {
        $referers = StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->select('referer', DB::raw('COUNT(*) as count'), DB::raw('COUNT(DISTINCT ip_address) as unique_count'))
            ->groupBy('referer')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                $referer = $item->referer;
                if (empty($referer)) {
                    $source = 'Direct';
                } else {
                    $parsed = parse_url($referer);
                    $source = $parsed['host'] ?? 'Unknown';
                }
                
                return [
                    'source' => $source,
                    'referer' => $referer,
                    'count' => $item->count,
                    'unique_count' => $item->unique_count,
                ];
            })
            ->groupBy('source')
            ->map(function ($group, $source) {
                return [
                    'source' => $source,
                    'count' => $group->sum('count'),
                    'unique_count' => $group->sum('unique_count'),
                ];
            })
            ->values()
            ->toArray();

        return $referers;
    }

    /**
     * Get hourly distribution
     */
    private function getHourlyDistribution(int $storeId, Carbon $startDate, Carbon $endDate): array
    {
        return StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->hour => $item->count];
            })
            ->toArray();
    }

    /**
     * Get daily trend
     */
    private function getDailyTrend(int $storeId, Carbon $startDate, Carbon $endDate): array
    {
        return StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as visits, COUNT(DISTINCT ip_address) as unique_visits')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'visits' => $item->visits,
                    'unique_visits' => $item->unique_visits,
                ];
            })
            ->toArray();
    }

    /**
     * Calculate bounce rate (visitors with only one page view)
     */
    private function calculateBounceRate(int $storeId, Carbon $startDate, Carbon $endDate): float
    {
        $totalSessions = StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->distinct('ip_address')
            ->count('ip_address');

        if ($totalSessions === 0) {
            return 0.0;
        }

        $singlePageSessions = StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->select('ip_address', DB::raw('COUNT(*) as page_count'))
            ->groupBy('ip_address')
            ->having('page_count', '=', 1)
            ->count();

        return round(($singlePageSessions / $totalSessions) * 100, 2);
    }

    /**
     * Get average session duration
     */
    private function getAverageSessionDuration(int $storeId, Carbon $startDate, Carbon $endDate): int
    {
        $avgDuration = StoreVisitor::forStore($storeId)
            ->inDateRange($startDate, $endDate)
            ->whereNotNull('session_duration')
            ->avg('session_duration');

        return intval($avgDuration ?? 0);
    }
}