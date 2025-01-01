<?php

use Illuminate\Http\Request;

if (!function_exists('authStore')) {
    function authStore(Request $request = null) {
        // Use the current request if no request is explicitly provided
        $request = $request ?? request();

        // Build the logic directly in the helper
        return $request->attributes->get('store_id') ?? session('store_id');
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
