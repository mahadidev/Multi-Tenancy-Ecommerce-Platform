<?php

namespace App\Http\Middleware;

use App\Models\Store;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class StoreMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Ensure the user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'You must be logged in to proceed.'], 401);
        }

        // Check if a store ID exists in the session or the request attributes
        $storeId = $request->attributes->get('store_id') ?? Session::get('store_id');

        if (!$storeId) {
            return response()->json(['message' => 'You must have an authorized store to proceed.'], 403);
        }

        // Verify that the store belongs to the authenticated user
        $store = Store::storeOwner()->active()->find($storeId);

        if (!$store) {
            return response()->json(['message' => 'You are not authorized to access this store.'], 403);
        }

        return $next($request);
    }
}
