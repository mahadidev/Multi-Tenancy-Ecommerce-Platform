<?php 

if (!function_exists('apiResponse')) {
    function apiResponse(callable $callback)
    {
        try {
            return $callback();
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage() ?: 'An error occurred.',
            ], 500);
        }
    }
}