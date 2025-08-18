<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCustomPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
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

        // Check if user is the store owner - owners have full access
        if ($storeId) {
            $store = \App\Modules\StoreManagement\Models\Store::find($storeId);
            if ($store && $store->owner_id === $user->id) {
                \Log::info('Permission Check - Store Owner', [
                    'user_id' => $user->id,
                    'store_id' => $storeId,
                    'permissions' => explode(',', $permission),
                    'is_owner' => true,
                    'has_permission' => true
                ]);
                
                return $next($request); // Store owners have full access
            }
        }

        // Handle multiple permissions (OR logic) - split by comma
        $permissions = array_map('trim', explode(',', $permission));
        $hasPermission = false;
        
        foreach ($permissions as $perm) {
            if ($user->hasCustomPermission($perm, $storeId)) {
                $hasPermission = true;
                break;
            }
        }
        
        \Log::info('Permission Check', [
            'user_id' => $user->id,
            'permissions' => $permissions,
            'store_id' => $storeId,
            'has_permission' => $hasPermission
        ]);
        
        if (!$hasPermission) {
            return response()->json([
                'success' => false,
                'message' => "Insufficient permissions. Required one of: " . implode(', ', $permissions)
            ], 403);
        }

        return $next($request);
    }
}