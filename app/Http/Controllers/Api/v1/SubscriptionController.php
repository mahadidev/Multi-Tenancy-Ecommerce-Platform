<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use Illuminate\Http\Request;
use App\Models\Subscription;

class SubscriptionController extends Controller
{
    public function index(){
        $plans = Subscription::get();

        return response()->json([
            'status' => 200,
            'data' => [
                'subscriptions' => SubscriptionResource::collection($plans)
            ]
        ]);
    }    
}
