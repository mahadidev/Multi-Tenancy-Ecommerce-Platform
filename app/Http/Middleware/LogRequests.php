<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\RequestLog;

class LogRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Store the request in the database
        RequestLog::create([
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => json_encode($request->headers->all()),
            'body' => json_encode($request->all()),
            'ip' => $request->ip(),
        ]);
        
        return $next($request);
    }
}
