<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use SteadFast\SteadFastCourierLaravelPackage\Facades\SteadfastCourier;

class SteadfastCourierController extends Controller
{
    public function placeOrder(Request $request)
    {
        // Validate incoming request data
        $validatedData = $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::find($validatedData['order_id']);

        // Prepare the data for the Steadfast API
        $orderData = [
            'invoice' => $order->uuid,
            'recipient_name' => $order->name,
            'recipient_phone' => $order->phone,
            'recipient_address' => $order->address,
            'cod_amount' => $order->total,
            'note' => $order->notes,
        ];
       
        $response = SteadfastCourier::placeOrder($orderData);

        // Handle the response accordingly
        if ($response['status'] == 200) {
            // Order placed successfully
            return response()->json([
                'status' => 200,
                'message' => $response['message'],
                'data' => $response['consignment']
            ], 200);
        } else {
            // Handle errors
            return response()->json(
                [
                    'status' => $response['status'],
                    'message' => 'Something went wrong while placing the order',
                    'error' => $response['errors']
                ],
                $response['status'],
            );
        }
    }
}
