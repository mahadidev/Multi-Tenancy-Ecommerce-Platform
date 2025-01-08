<?php

namespace App\Http\Controllers\Api\v1\site;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Http\Resources\StoreResource;

class StoreController extends Controller
{
    // show store 
    public function show(Request $request)
    {
        // $store = Store::active()->find($request->store_id);
        $store = Store::active()->where('domain', $request->domain)->first();

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Store not found',
            ]);
        }

        // store store_id in session
        session(['store_id' => $store->id]);
        $request->attributes->set('store_id', $store->id);

        return response()->json([
            'status' => 200,
            'data' => [
                'store' => new StoreResource($store),
            ],
        ]);
    }

    public function test(Request $request)
    {
        return response()->json([
            'status' => 200,
            'message' => 'Test route',
        ]);
    }
}
