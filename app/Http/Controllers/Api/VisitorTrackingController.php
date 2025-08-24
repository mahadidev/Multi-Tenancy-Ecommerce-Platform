<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\AnalyticsManagement\Models\StoreVisitor;
use App\Modules\StoreManagement\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class VisitorTrackingController extends Controller
{
    /**
     * Track page view
     */
    public function trackPageView(Request $request)
    {
        $request->validate([
            'sessionId' => 'required|string',
            'url' => 'required|string',
            'referrer' => 'nullable|string',
            'title' => 'nullable|string',
            'timestamp' => 'required|integer',
            'deviceInfo' => 'required|array',
        ]);

        $store = $this->getStoreFromUrl($request->input('url'));
        if (!$store) {
            return response()->json(['status' => 404, 'message' => 'Store not found'], 404);
        }

        $sessionId = $request->input('sessionId');
        $deviceInfo = $request->input('deviceInfo');

        // Create or update visitor record
        StoreVisitor::updateOrCreate(
            [
                'store_id' => $store->id,
                'ip_address' => $request->ip(),
                'created_at' => Carbon::today(), // Group by day
            ],
            [
                'user_agent' => $deviceInfo['userAgent'] ?? $request->header('User-Agent'),
                'referer' => $request->input('referrer'),
                'page_url' => $request->input('url'),
                'device_type' => $deviceInfo['deviceType'] ?? 'desktop',
                'browser' => $this->detectBrowser($deviceInfo['userAgent'] ?? ''),
                'os' => $this->detectOS($deviceInfo['userAgent'] ?? ''),
                'updated_at' => now(),
            ]
        );

        // Store session data in cache for session tracking
        $cacheKey = "visitor_session:{$sessionId}";
        $sessionData = Cache::get($cacheKey, []);
        $sessionData['store_id'] = $store->id;
        $sessionData['last_page'] = $request->input('url');
        $sessionData['last_activity'] = now();
        Cache::put($cacheKey, $sessionData, now()->addHours(24));

        return response()->json(['status' => 200, 'message' => 'Page view tracked']);
    }

    /**
     * Track session data
     */
    public function trackSession(Request $request)
    {
        $request->validate([
            'sessionId' => 'required|string',
            'duration' => 'required|integer',
            'pageViews' => 'required|integer',
            'maxScrollDepth' => 'required|integer',
            'clicks' => 'required|integer',
            'url' => 'required|string',
            'timestamp' => 'required|integer',
        ]);

        $sessionId = $request->input('sessionId');
        $cacheKey = "visitor_session:{$sessionId}";
        $sessionData = Cache::get($cacheKey);

        if ($sessionData && isset($sessionData['store_id'])) {
            // Update the visitor record with session duration
            StoreVisitor::where('store_id', $sessionData['store_id'])
                ->where('ip_address', $request->ip())
                ->whereDate('created_at', Carbon::today())
                ->update([
                    'session_duration' => intval($request->input('duration') / 1000), // Convert to seconds
                    'updated_at' => now(),
                ]);
        }

        return response()->json(['status' => 200, 'message' => 'Session tracked']);
    }

    /**
     * Track custom events
     */
    public function trackEvent(Request $request)
    {
        $request->validate([
            'sessionId' => 'required|string',
            'eventType' => 'required|string',
            'url' => 'required|string',
            'timestamp' => 'required|integer',
        ]);

        // For now, just log events. In the future, you could store them in a separate events table
        \Log::info('Visitor Event Tracked', [
            'session_id' => $request->input('sessionId'),
            'event_type' => $request->input('eventType'),
            'url' => $request->input('url'),
            'data' => $request->except(['sessionId', 'eventType', 'url', 'timestamp']),
            'ip' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
        ]);

        return response()->json(['status' => 200, 'message' => 'Event tracked']);
    }

    /**
     * Get store from URL
     */
    private function getStoreFromUrl(string $url): ?Store
    {
        // Parse URL to get the store domain/slug
        $parsed = parse_url($url);
        $path = $parsed['path'] ?? '';
        
        // Extract store identifier from path like /sites/store-slug/
        if (preg_match('/\/sites\/([^\/]+)/', $path, $matches)) {
            $storeDomain = $matches[1];
            return Store::where('domain', $storeDomain)->first();
        }

        // Check if it's a custom domain
        $host = $parsed['host'] ?? '';
        if ($host && $host !== request()->getHost()) {
            return Store::where('domain', $host)->first();
        }

        return null;
    }

    /**
     * Detect browser from user agent
     */
    private function detectBrowser(string $userAgent): string
    {
        if (empty($userAgent)) return 'Unknown';

        if (strpos($userAgent, 'Chrome') !== false && strpos($userAgent, 'Edg') === false) {
            return 'Chrome';
        } elseif (strpos($userAgent, 'Edg') !== false) {
            return 'Edge';
        } elseif (strpos($userAgent, 'Firefox') !== false) {
            return 'Firefox';
        } elseif (strpos($userAgent, 'Safari') !== false && strpos($userAgent, 'Chrome') === false) {
            return 'Safari';
        } elseif (strpos($userAgent, 'Opera') !== false || strpos($userAgent, 'OPR') !== false) {
            return 'Opera';
        } elseif (strpos($userAgent, 'Trident') !== false || strpos($userAgent, 'MSIE') !== false) {
            return 'Internet Explorer';
        }

        return 'Unknown';
    }

    /**
     * Detect OS from user agent
     */
    private function detectOS(string $userAgent): string
    {
        if (empty($userAgent)) return 'Unknown';

        if (preg_match('/Windows NT ([\d.]+)/i', $userAgent, $matches)) {
            return 'Windows ' . $this->getWindowsVersion($matches[1]);
        } elseif (preg_match('/Mac OS X ([\d_]+)/i', $userAgent, $matches)) {
            return 'macOS ' . str_replace('_', '.', $matches[1]);
        } elseif (preg_match('/Android ([\d.]+)/i', $userAgent, $matches)) {
            return 'Android ' . $matches[1];
        } elseif (preg_match('/iPhone OS ([\d_]+)/i', $userAgent, $matches)) {
            return 'iOS ' . str_replace('_', '.', $matches[1]);
        } elseif (strpos($userAgent, 'Linux') !== false) {
            return 'Linux';
        }

        return 'Unknown';
    }

    /**
     * Get Windows version name from version number
     */
    private function getWindowsVersion(string $version): string
    {
        $versions = [
            '10.0' => '10',
            '6.3' => '8.1',
            '6.2' => '8',
            '6.1' => '7',
            '6.0' => 'Vista',
            '5.2' => 'XP x64',
            '5.1' => 'XP',
        ];

        return $versions[$version] ?? $version;
    }
}