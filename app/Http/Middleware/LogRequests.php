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
                'headers' => json_encode($this->sanitizeHeaders($request->headers->all())),
                'body' => json_encode($this->sanitizeBody($request->all())),
                'ip' => $request->ip(),
            ]);
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::warning('Failed to log request: ' . $e->getMessage());
        }
        
        return $next($request);
    }

    private function sanitizeHeaders(array $headers): array
    {
        $sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
        $sanitized = [];
        
        foreach ($headers as $key => $value) {
            if (in_array(strtolower($key), $sensitiveHeaders)) {
                $sanitized[$key] = ['[REDACTED]'];
            } else {
                $sanitized[$key] = $value;
            }
        }
        
        return $sanitized;
    }

    private function sanitizeBody(array $body): array
    {
        $sensitiveFields = ['password', 'token', 'secret', 'key', 'credit_card', 'ssn'];
        $sanitized = [];
        
        foreach ($body as $key => $value) {
            if (is_string($key) && $this->containsSensitiveData($key)) {
                $sanitized[$key] = '[REDACTED]';
            } else {
                $sanitized[$key] = $value;
            }
        }
        
        return $sanitized;
    }

    private function containsSensitiveData(string $field): bool
    {
        $sensitivePatterns = ['password', 'token', 'secret', 'key', 'credit', 'card', 'ssn', 'api_key'];
        
        foreach ($sensitivePatterns as $pattern) {
            if (stripos($field, $pattern) !== false) {
                return true;
            }
        }
        
        return false;
    }
}
