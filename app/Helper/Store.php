<?php

use Illuminate\Http\Request;
use App\Models\StoreSession;

if (!function_exists('authStore')) {
    function authStore(Request $request = null) {
        // Use the current request if no request is explicitly provided
        $request = $request ?? request();

        $storeSession = StoreSession::where('user_id', auth()->id())->first();

        // Check if a store ID exists in the session or the request attributes
        $storeId = $storeSession ? $storeSession->store_id : ($request->attributes->get('store_id') ?? session('store_id'));

        // Build the logic directly in the helper
        return  $storeId;
    }
}

if (!function_exists('getStore')) {
    function getStore(Request $request = null) {
        // Use the current request if no request is explicitly provided
        $request = $request ?? request();

        $store = \App\Models\Store::findorfail(authStore());

        return $store;
    }
}
