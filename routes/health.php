<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Queue;

Route::get('/health', function () {
    try {
        // Check database connection
        $dbStatus = 'connected';
        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $dbStatus = 'disconnected: ' . $e->getMessage();
        }

        // Check Redis connection
        $redisStatus = 'connected';
        try {
            Redis::ping();
        } catch (\Exception $e) {
            $redisStatus = 'disconnected: ' . $e->getMessage();
        }

        // Check queue status
        $queueSize = 'unknown';
        try {
            $queueSize = Queue::size();
        } catch (\Exception $e) {
            $queueSize = 'error: ' . $e->getMessage();
        }

        // Check cache status
        $cacheStatus = 'connected';
        try {
            cache()->put('health_check', 'ok', 10);
            cache()->get('health_check');
        } catch (\Exception $e) {
            $cacheStatus = 'disconnected: ' . $e->getMessage();
        }

        $status = $dbStatus === 'connected' && $redisStatus === 'connected' ? 'ok' : 'error';

        return response()->json([
            'status' => $status,
            'timestamp' => now()->toISOString(),
            'version' => config('app.version', '1.0.0'),
            'environment' => config('app.env'),
            'services' => [
                'database' => $dbStatus,
                'redis' => $redisStatus,
                'cache' => $cacheStatus,
                'queue_size' => $queueSize,
            ],
            'system' => [
                'memory_usage' => round(memory_get_usage(true) / 1024 / 1024, 2) . ' MB',
                'peak_memory' => round(memory_get_peak_usage(true) / 1024 / 1024, 2) . ' MB',
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
            ]
        ], $status === 'ok' ? 200 : 503);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'timestamp' => now()->toISOString(),
            'error' => $e->getMessage(),
        ], 503);
    }
});

Route::get('/health/simple', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
});

// Queue health check
Route::get('/health/queue', function () {
    try {
        $queueSize = Queue::size();
        $failedJobs = DB::table('failed_jobs')->count();
        
        return response()->json([
            'status' => 'ok',
            'queue_size' => $queueSize,
            'failed_jobs' => $failedJobs,
            'timestamp' => now()->toISOString(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'error' => $e->getMessage(),
            'timestamp' => now()->toISOString(),
        ], 503);
    }
});

// Database health check
Route::get('/health/database', function () {
    try {
        $connection = DB::connection();
        $pdo = $connection->getPdo();
        
        // Test basic query
        $result = $connection->select('SELECT 1 as test');
        
        return response()->json([
            'status' => 'ok',
            'connection' => 'connected',
            'database' => $connection->getDatabaseName(),
            'driver' => $connection->getDriverName(),
            'timestamp' => now()->toISOString(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'error' => $e->getMessage(),
            'timestamp' => now()->toISOString(),
        ], 503);
    }
});

// Redis health check
Route::get('/health/redis', function () {
    try {
        $redis = Redis::connection();
        
        // Test Redis operations
        $redis->set('health_test', 'ok', 'EX', 10);
        $value = $redis->get('health_test');
        $redis->del('health_test');
        
        $info = $redis->info('memory');
        
        return response()->json([
            'status' => $value === 'ok' ? 'ok' : 'error',
            'connection' => 'connected',
            'memory_used' => $info['used_memory_human'] ?? 'unknown',
            'timestamp' => now()->toISOString(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'error' => $e->getMessage(),
            'timestamp' => now()->toISOString(),
        ], 503);
    }
});