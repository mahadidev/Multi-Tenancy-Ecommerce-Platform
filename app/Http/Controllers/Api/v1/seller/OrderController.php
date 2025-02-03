<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderStatusUpdated;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $store = getStore();

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store Id',
            ]);
        }

        $orders = $store->orders ?? [];

        return response()->json([
            'status' => 200,
            'data' => [
                'orders' => OrderResource::collection($orders),
            ],
        ]);
    }

    public function show(Request $request, $id){
        
        $order = Order::authorized()->find($id);

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid order Id',
            ]);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'order' => OrderResource::make($order),
            ],
        ]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,shipping,confirmed,canceled,processing,refunded,delivered,failed,returned,completed',
        ]);

        $order = Order::authorized()->find($id);

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid order Id',
            ]);
        }

        $order->update([
            'status' => $request->status,
        ]);

        try {
            if (env('APP_ENV') == 'production') {
                // Send email to the user
                Mail::to($order->user->email)->send(new OrderStatusUpdated($order));
            } 
        } catch (\Exception $e) {
            Log::error('Order update failed: ' . $e->getMessage());
            return response()->json(['status'=> 500,'message' => 'Order update failed'], 500);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order has been updated',
            'data' => [
                'order' => OrderResource::make($order),
            ],
        ]);
    }
}
