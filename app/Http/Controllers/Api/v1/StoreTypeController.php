<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreTypeResource;
use App\Models\StoreType;
use Illuminate\Http\Request;

class StoreTypeController extends Controller
{
    public function index(Request $request){
        $storeTypes = StoreType::latest()->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'store_types' => StoreTypeResource::collection($storeTypes)
            ]
        ], 200);
    }
}
