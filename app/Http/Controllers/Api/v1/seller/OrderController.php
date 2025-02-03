<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderStatusUpdated;
use App\Models\Store;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->input('sort'); // Sort order, 
        $perPage = $request->input('per_page'); // Items per page,

        $store = getStore();

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store Id',
            ]);
        }

        // $orders = $store->orders ?? [];

        // $paginated = $perPage ? $orders->paginate($perPage) : $orders;

        // Start with a query builder instead of getting collection
        $ordersQuery = $store->orders();

        // Apply sorting if provided
        if ($sort) {
            $ordersQuery->orderBy('created_at', $sort);
        }

        // Paginate if per_page is provided, otherwise get all
        $paginated = $perPage
            ? $ordersQuery->paginate($perPage)
            : $ordersQuery->get();

        $response = [
            'status' => 200,
            'data' => [
                'orders' => OrderResource::collection($paginated),
            ],
        ];

        // Add pagination meta data if `per_page` is provided
        if ($perPage) {
            $response['meta'] = [
                'current_page' => $paginated->currentPage(),
                'first_page_url' => $paginated->url(1),
                'last_page' => $paginated->lastPage(),
                'last_page_url' => $paginated->url($paginated->lastPage()),
                'next_page_url' => $paginated->nextPageUrl(),
                'prev_page_url' => $paginated->previousPageUrl(),
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
            ];
        }

        return response()->json($response);
    }

    public function show(Request $request, $id)
    {

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

        $store = Store::find($order->store_id);

        $appUrl = config('app.url');

        // Ensure we have a trailing slash
        if (!str_ends_with($appUrl, '/')) {
            $appUrl .= '/';
        }

        // Get store logo URL
        $logoUrl = null;
        if ($store->logo) {
            $logoUrl = $appUrl . 'storage/' . $store->logo;
        } else {
            $logoUrl = $appUrl . 'images/logo-text.png';
        }

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
                Mail::to($order->user->email)->send(new OrderStatusUpdated($order, $store, $logoUrl));
            }
        } catch (\Exception $e) {
            Log::error('Order update failed: ' . $e->getMessage());
            return response()->json(['status' => 500, 'message' => 'Order update failed'], 500);
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
