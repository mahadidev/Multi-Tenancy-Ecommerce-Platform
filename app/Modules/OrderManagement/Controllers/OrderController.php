<?php

namespace App\Modules\OrderManagement\Controllers;

use App\Exceptions\OrderProcessingException;
use App\Http\Controllers\Controller;
use App\Modules\OrderManagement\Resources\OrderResource;
use Illuminate\Http\Request;
use App\Modules\OrderManagement\Models\Order;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderStatusUpdated;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\UserManagement\Models\User;
use App\Modules\OrderManagement\Services\OrderService;
use App\Notifications\OrderNotification;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

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

        // Start with a query builder instead of getting collection
        $ordersQuery = $store->orders()->latest();

        // Apply date filtering
        $this->applyDateFilters($ordersQuery, $request);

        // Apply search filtering
        $this->applySearchFilters($ordersQuery, $request);

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

        if(!$order){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid order Id',
            ]);
        }

        $store = Store::find($order->store_id);

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store Id',
            ]);
        }

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

        $customer = User::find($order->user_id);

        try {
            if (env('APP_ENV') == 'production' || env('APP_ENV') == 'local') {
                // Send email to the user
                $customer->notify(new OrderNotification($order, $store, $logoUrl));
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

    public function placeOrder(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|max:255',
            'phone' => 'required',
            'address' => 'required|string|max:2000',
            'notes' => 'nullable|string|max:1000',
            'payment_method' => 'required|in:cash,card',
            'user_id' => 'required|exists:users,id',
        ]);

        $response = \App\Http\Controllers\Api\v1\site\OrderController::placeOrder($request, $request->user_id);

        return $response->original;
    }

    public function placeOrderNonUser(Request $request)
    {
        try {
            return $this->orderService->placeOrderForGuest($request);
        } catch (OrderProcessingException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function report(Request $request)
    {
        try {
            $request->validate([
                'period' => 'sometimes|in:today,week,month,year,custom',
                'start_date' => 'required_if:period,custom|date',
                'end_date' => 'required_if:period,custom|date',
            ]);

            $period = $request->input('period', 'today');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $report = $this->orderService->getOrderReport($period, $startDate, $endDate);

            return response()->json([
                'status' => 200,
                'data' => [ 'report' => $report],
            ]);
        } catch (OrderProcessingException $e) {
            return response()->json([
                'status' => 400,
                'message' => $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            Log::error('Order report failed: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Failed to generate order report',
            ], 500);
        }
    }

    /**
     * Apply date filters to the orders query
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param \Illuminate\Http\Request $request
     * @return void
     */
    protected function applyDateFilters($query, Request $request)
    {
        $period = $request->input('period');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        if ($period === 'today') {
            $query->whereBetween('created_at', [
                now()->startOfDay(),
                now()->endOfDay()
            ]);
        } elseif ($period === 'week') {
            $query->whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ]);
        } elseif ($period === 'month') {
            $query->whereMonth('created_at', now()->month)
                  ->whereYear('created_at', now()->year);
        } elseif ($period === 'year') {
            $query->whereYear('created_at', now()->year);
        } elseif ($period === 'custom' && $startDate && $endDate) {
            $query->whereBetween('created_at', [
                \Carbon\Carbon::parse($startDate)->setTimezone(config('app.timezone'))->startOfDay(),
                \Carbon\Carbon::parse($endDate)->setTimezone(config('app.timezone'))->endOfDay()
            ]);
        }
    }

    /**
     * Apply search filters to the orders query
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param \Illuminate\Http\Request $request
     * @return void
     */
    protected function applySearchFilters($query, Request $request)
    {
        if ($request->filled('search')) {
            $searchTerm = strtolower($request->search);
            $query->where(function ($q) use ($searchTerm) {
                $q->whereRaw('LOWER(order_uuid) LIKE ?', ['%' . $searchTerm . '%'])
                  ->orWhereRaw('LOWER(name) LIKE ?', ['%' . $searchTerm . '%'])
                  ->orWhereRaw('LOWER(email) LIKE ?', ['%' . $searchTerm . '%'])
                  ->orWhereRaw('LOWER(phone) LIKE ?', ['%' . $searchTerm . '%'])
                  ->orWhere('total', 'LIKE', '%' . $searchTerm . '%');
            });
        }

        // Apply status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Apply payment method filter
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }
    }
}