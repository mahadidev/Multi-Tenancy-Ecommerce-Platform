<?php

namespace App\Http\Controllers\Api\v1\site;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\Cart;
use App\Models\Store;
use App\Models\OrderItem;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf as FacadePdf;

class OrderController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search'); // Search keyword
        $sort = $request->input('sort'); // Sort order, 
        $perPage = $request->input('per_page'); // Items per page,

        $orders = Order::currentStore()
            ->where('user_id', auth()->user()->id)
            ->when($search, function ($query, $search) {
                $query
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('phone', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%')
                    ->orWhere('payment_method', 'like', '%' . $search . '%');
            })
            ->with('items')
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $orders->paginate($perPage) : $orders->get();

        // Prepare the response
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

        return response()->json($response, 200);
    }

    public static function placeOrder(Request $request, $userID = null)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|max:255',
            'phone' => 'required',
            'address' => 'required|string|max:2000',
            'notes' => 'nullable|string|max:1000',
            'payment_method' => 'required|in:cash,card',
        ]);
        if($userID != null){
            $storeID = authStore();
        }
        else{
            $storeID = $request->has('store_id') ? $request->store_id : session()->get('site_store_id');
        }
        $store = Store::active()->find($storeID);

        if (!$store || !$storeID) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid Store Id',
            ]);
        }

        // Begin a transaction to ensure all or nothing happens
        DB::beginTransaction();

        try {

            $sessionId = $request->has('session_id') ? $request->session_id : null;
            $user = $userID == null ? auth()->user() : User::storeRegistered()->find($userID);

            if(!$user){
                return response()->json([
                    'status' => 404,
                    'message' => 'Invalid User Id, not a registered user for this store'
                ],404);
            }

            $cartItems = Cart::with('product')
                ->when($sessionId, function ($query, $sessionId) {
                    return $query->where('session_id', $sessionId);
                })
                ->orWhere('user_id', $user->id)
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Cart is empty!',
                ]);
            }

            $serviceFee = 0;
            $itemSubtotal = collect($cartItems)->sum('total');
            $totalAmount = $itemSubtotal + $serviceFee;

            $order = Order::create([
                'uuid' => $sessionId ? $sessionId : (string) Str::uuid(),
                'user_id' => $user->id,
                'store_id' => $store->id,
                'name' => $request->input('name'),
                'phone' => $request->input('phone'),
                'email' => $request->input('email') ?? null,
                'address' => $request->input('address'),
                'notes' => $request->input('notes'),
                'payment_method' => $request->input('payment_method'),
                'total' => $totalAmount,
                'status' => 'pending',
            ]);

            foreach ($cartItems as $item) {
                // Retrieve the product to get price and other details
                $product = Product::where('id', $item['product_id'])->first();

                // Create an order item for each cart item
                OrderItem::create([
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'store_id' => $store->id,
                    'item' => $product->name,
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'total' => $item['total'],
                    'shop_id' => $product->shop_id,
                ]);
            }


            // Optionally, clear the cart after order is placed
            Cart::where('session_id', $sessionId)->orWhere('user_id', $user->id)->delete();

            // Commit the transaction
            DB::commit();

            // Regenerate the session ID to ensure a unique UUID for each order
            // session()->regenerate();

            // Send notifications from order model
            $order->sendOrderConfirmationNotifications();

            return response()->json([
                'status' => 200,
                'message' => 'Order placed successfully',
                'data' => [
                    'order' => new OrderResource($order->load('items')),
                ]
            ]);
        } catch (\Exception $e) {
            // Rollback transaction if something goes wrong
            DB::rollBack();

            // Log the exception details
            Log::error('Order placement failed: ' . $e->getMessage(), [
                'exception' => $e,
                'session_id' => $sessionId, // Optionally log additional context
            ]);

            return response()->json([
                'status' => 500,
                'message' => 'Order placement failed',
            ]);
        }
    }

    public function downloadOrderDetails($uuid, $isCustomer)
    {
        $order = Order::where('uuid', $uuid)->with('items')->first();
        $store = Store::select('id', 'logo', 'name', 'phone', 'domain', 'location', 'email', 'currency')->find($order->store_id);
        $store->domain = $store->domain();

        $pdf = FacadePdf::loadView('pdf.order_confirmation', [
            'order' => $order,
            'store' => $store,
            'isCustomer' => $isCustomer,
        ])->setPaper('a4');

        return $pdf->download("Order-{$order->uuid}.pdf");
    }
}
