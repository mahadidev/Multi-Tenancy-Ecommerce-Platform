<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShipmentResource;
use App\Models\Order;
use App\Models\StoreShipment;
use Illuminate\Http\Request;
use SteadFast\SteadFastCourierLaravelPackage\Facades\SteadfastCourier;

class SteadfastCourierController extends Controller
{
    public function placeOrder(Request $request)
    {
        // Validate incoming request data
        $validatedData = $request->validate([
            'orders' => 'required|array',
            'orders.*' => 'exists:orders,id',
        ]);

        $orders = Order::whereIn('id', $validatedData['orders'])->where('is_shipped', 0)->get();

        if ($orders->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No orders found for shipping',
            ], 404);
        }

        // Split orders into chunks of 500
        $orderChunks = $orders->chunk(500);
        $allShipments = [];

        foreach ($orderChunks as $chunk) {
            $ordersData = [];

            foreach ($chunk as $order) {
                $ordersData[] = [
                    'invoice' => $order->uuid,
                    'recipient_name' => $order->name,
                    'recipient_phone' => $order->phone,
                    'recipient_address' => $order->address,
                    'cod_amount' => $order->total,
                    'note' => $order->notes,
                ];
            }

            $response = SteadfastCourier::bulkCreateOrders($ordersData);

            if ($response['status'] == 200) {
                $shippmentData = $response['data'];
                $allShipments = array_merge($allShipments, $shippmentData);

                foreach ($shippmentData as $shipment) {
                    // Update order information
                    $order = Order::authorized()->where('uuid', $shipment['invoice'])->first();

                    if ($order) {
                        $order->is_shipped = true;
                        $order->save();

                        // Save shipment information
                        StoreShipment::create([
                            'invoice' => $shipment['invoice'],
                            'recipient_name' => $shipment['recipient_name'],
                            'recipient_phone' => $shipment['recipient_phone'],
                            'recipient_address' => $shipment['recipient_address'],
                            'cod_amount' => $shipment['cod_amount'],
                            'note' => $shipment['note'],
                            'consignment_id' => $shipment['consignment_id'],
                            'tracking_code' => $shipment['tracking_code'],
                            'status' => 'in_review',
                            'order_id' => $order->id,
                            'store_id' => $order->store_id,
                        ]);
                    }
                }
            } else {
                return response()->json([
                    'status' => $response['status'],
                    'message' => 'Something went wrong while placing the order',
                    'error' => $response['errors'],
                ], $response['status']);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Orders have been shipped successfully',
        ], 200);
    }


    public function trackOrder(Request $request, $code) {

        $shipment = StoreShipment::where('tracking_code', $code)->first();

        if (!$shipment) {
            return response()->json([
                'status' => 404,
                'message' => 'No shipment found',
            ], 404);
        }

        $response = SteadfastCourier::checkDeliveryStatusByTrackingCode($code);

        $shipment->update([
            'status' => $response['delivery_status'],
        ]);

        return response()->json([
            'status' => $response['status'],
            'data' => [
                'delivery_status' => $response['delivery_status'],
                'shipment' => ShipmentResource::make($shipment),
            ]
        ]);
    }

    public function syncShipments(Request $request) {

        $shipments = StoreShipment::where('store_id', authStore())
        ->whereNotIn('status', ['cancelled', 'delivered'])
        ->get();

        if ($shipments->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No shipments found for syncing',
            ], 404);
        }

        foreach($shipments as $shipment) {
            $response = SteadfastCourier::checkDeliveryStatusByTrackingCode($shipment->tracking_code);

            if ($response['status'] == 200) {
                $shipment->update([
                    'status' => $response['delivery_status'],
                ]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Shipments have been synced successfully',
        ], 200);
    }
}
