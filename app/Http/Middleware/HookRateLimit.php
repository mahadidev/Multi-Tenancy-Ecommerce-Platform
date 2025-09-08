<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\JsonResponse;

class HookRateLimit
{
    private const MAX_ATTEMPTS = 100; // requests per minute
    private const DECAY_MINUTES = 1;

    public function handle(Request $request, Closure $next): Response
    {
        $key = $this->resolveRequestSignature($request);
        
        $attempts = Cache::get($key, 0);
        
        if ($attempts >= self::MAX_ATTEMPTS) {
            return response()->json([
                'success' => false,
                'message' => 'Too many requests. Please try again later.'
            ], 429);
        }
        
        Cache::put($key, $attempts + 1, now()->addMinutes(self::DECAY_MINUTES));
        
        return $next($request);
    }

    private function resolveRequestSignature(Request $request): string
    {
        // Combine IP and subdomain for more granular rate limiting
        $subdomain = $request->header('X-Subdomain', 'unknown');
        return 'hook_rate_limit:' . $request->ip() . ':' . $subdomain;
    }
}