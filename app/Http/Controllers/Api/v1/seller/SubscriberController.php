<?php

namespace App\Http\Controllers\Api\v1\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subscriber;

class SubscriberController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $store_id)
    {
        return apiResponse(function () use ($request, $store_id) {
           
            $validated = $request->validate([
                'email' => 'required|email|max:255',
                // 'store_id' => 'required|integer',
            ]);

            // check if the email is already subscribed for the same store
            $subscriber = Subscriber::where('email', $validated['email'])
                ->where('store_id', $store_id)
                ->first();

            if ($subscriber) {
                return response()->json(
                    [
                        'status' => 200,
                        'message' => 'Already subscribed',
                        'data' => [
                            'subscribers' => $subscriber
                        ]
                    ]
                );
            }

            $subscriber = Subscriber::create([
                'email' => $validated['email'],
                'store_id' => $store_id,
            ]);

            return response()->json(
                [
                    'status' => 200,
                    'message' => 'Subscribed successfully',
                    'data' => [
                        'subscribers' => $subscriber
                    ]
                ]
            );
        });
    }

}
