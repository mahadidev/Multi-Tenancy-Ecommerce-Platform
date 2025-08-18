<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCustomRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required.'
            ], 401);
        }

        // Get store ID from the request or current context
        $storeId = null;
        if ($request->route('store')) {
            $storeId = $request->route('store');
        } elseif (function_exists('authStore') && authStore()) {
            $storeId = authStore();
        }

        // Check if user has any of the required roles
        if (!$user->hasAnyCustomRole($roles, $storeId)) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient role permissions.'
            ], 403);
        }

        return $next($request);
    }
}