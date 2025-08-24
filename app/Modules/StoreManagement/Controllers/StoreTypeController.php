<?php

namespace App\Modules\StoreManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\StoreManagement\Resources\StoreTypeResource;
use App\Modules\StoreManagement\Models\StoreType;
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