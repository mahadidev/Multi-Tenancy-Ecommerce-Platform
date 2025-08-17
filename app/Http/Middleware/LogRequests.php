<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Modules\AnalyticsManagement\Models\RequestLog;

class LogRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Store the request in the database
            RequestLog::create([
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'headers' => json_encode($request->headers->all()),
                'body' => json_encode($request->all()),
                'ip' => $request->ip(),
            ]);
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::warning('Failed to log request: ' . $e->getMessage());
        }
        
        return $next($request);
    }
}
