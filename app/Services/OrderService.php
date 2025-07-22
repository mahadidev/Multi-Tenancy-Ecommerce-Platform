<?php

namespace App\Services;

use App\Models\ProductStock;
use App\Models\Store;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Exceptions\OrderProcessingException;
use Illuminate\Support\Facades\Log;

class OrderService
{
    /**
     * Place an order for a non-authenticated user
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws OrderProcessingException
     */
    public function placeOrderForGuest(Request $request)
    {
        $validatedData = $this->validateRequest($request);
        $storeId = $this->getStoreId();

        try {
            DB::beginTransaction();

            $order = $this->createOrder($validatedData, $storeId);

            $this->processOrderItems($order, $validatedData['items'], $storeId);
            $this->updateOrderTotal($order);

            DB::commit();

            return $this->buildSuccessResponse($order);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order processing failed: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);

            throw new OrderProcessingException('Failed to process order. Please try again.');
        }
    }

    /**
     * Validate the incoming request
     *
     * @param Request $request
     * @return array
     */
    protected function validateRequest(Request $request): array
    {
        return $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable',
            'address' => 'nullable|string|max:2000',
            'notes' => 'nullable|string|max:1000',
            'status' => 'nullable|string|max:255',
            'payment_method' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.stock_id' => 'required|exists:product_stocks,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.discount_amount' => 'nullable|numeric|min:0',
            'items.*.tax' => 'nullable|numeric|min:0|max:100',
        ]);
    }

    /**
     * Get the authenticated store ID
     *
     * @return int
     * @throws OrderProcessingException
     */
    protected function getStoreId(): int
    {
        $storeId = authStore();

        if (!$storeId) {
            throw new OrderProcessingException('Store identification failed.');
        }

        return $storeId;
    }

    /**
     * Create the order record
     *
     * @param array $data
     * @param int $storeId
     * @return Order
     */
    protected function createOrder(array $data, int $storeId): Order
    {
        return Order::create([
            'uuid' => Str::orderedUuid(),
            'user_id' => null,
            'store_id' => $storeId,
            'name' => $data['name'] ?? "",
            'phone' => $data['phone'] ?? "",
            'email' => $data['email'] ?? "",
            'address' => $data['address'] ?? "",
            'notes' => $data['notes'] ?? '',
            'payment_method' => $data['payment_method'] ?? "",
            'total' => 0, // Will be updated after items are processed
            'status' => $data['status'] ?? 'pending',
        ]);
    }

    /**
     * Process all order items
     *
     * @param Order $order
     * @param array $items
     * @param int $storeId
     */
    protected function processOrderItems(Order $order, array $items, int $storeId): void
    {
        foreach ($items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $stock = ProductStock::where(["id" => $item["stock_id"]])->first();

            // Check stock availability
            if ($stock->qty < $item['qty']) {
                throw new OrderProcessingException("Not enough stock for product: {$product->name}. Available: {$stock->qty}, Requested: {$item['qty']}");
            }

            $this->createOrderItem($order, $product, $item, $storeId);

            // Deduct stock
            $product->decrement('stock', $item["qty"]);
        }
    }


    protected function createOrderItem(
        Order $order,
        Product $product,
        array $itemData,
        int $storeId
    ): OrderItem {
        $discount = (float) ($itemData['discount_amount'] ?? 0); // Default to 0 if not set
        $quantity = (int) $itemData['qty'];
        $taxRate = (float) ($itemData['tax'] ?? 0); // Default to 0 if not set

        // Calculate the total price before discount
        $price = $product->price * $quantity;
        $discount_price = ($product->price * $quantity) - $discount;
        $total = (($price + ($price * $taxRate)) * $quantity) - $discount;

        // stock
        $stock = ProductStock::where(["id" => $itemData["stock_id"]])->first();

        // set name
        $title = $product->name;
        foreach ($stock->items as $item) {
            $title = $title . " " . $item->variantOption->label;
        }

        // minus stock
        $stock->update(["qty" => $stock->qty - $quantity]);


        return OrderItem::create([
            'order_id' => $order->id,
            'user_id' => null,
            'product_id' => $product->id,
            'store_id' => $storeId,
            'item' => $title,
            'qty' => $quantity,
            'price' => $price, // Original unit price
            'total' => $total, // Original unit price
            'discount_price' => $discount_price, // Added discount amount for reference
            'tax' => $taxRate,
            'shop_id' => $product->shop_id,
            'product_stock_id' => $stock->id,
        ]);
    }


    protected function updateOrderTotal(Order $order): void
    {
        $total = $order->items()->sum('total');
        $order->update(['total' => $total]);
    }


    protected function buildSuccessResponse(Order $order)
    {
        return response()->json([
            "status" => 200,
            'success' => true,
            'message' => 'Order placed successfully',
            'data' => [
                'order' => new OrderResource($order->load('items')),
            ]
        ]);
    }

    public function getOrderReport(string $period = "month", ?string $start_date = null, ?string $end_date = null)
    {
        $storeId = $this->getStoreId();
        $query = Order::where('store_id', $storeId);

        switch ($period) {
            case 'today':
                $query->whereDate('created_at', now()->today());
                break;
            case 'week':
                $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'month':
                $query->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()]);
                break;
            case 'year':
                $query->whereBetween('created_at', [now()->startOfYear(), now()->endOfYear()]);
                break;
            case 'custom':
                if (!$start_date || !$end_date) {
                    throw new OrderProcessingException('Start date and end date are required for custom period');
                }
                $query->whereBetween('created_at', [
                    Carbon::parse($start_date)->startOfDay(),
                    Carbon::parse($end_date)->endOfDay()
                ]);
                break;
            default:
                // Default to last 30 days
                $query->whereBetween('created_at', [now()->subDays(30), now()]);
        }

        // Get basic statistics
        $totalOrders = $query->count();
        $totalRevenue = $query->sum('total');
        $paidRevenue = (clone $query)->where('is_payed', true)->sum('total');
        $pendingRevenue = (clone $query)->where('is_payed', false)->sum('total');

        // Get order status distribution
        $statusDistribution = $query->clone()
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        // Get payment method distribution
        $paymentMethodDistribution = $query->clone()
            ->select('payment_method', DB::raw('count(*) as count'))
            ->groupBy('payment_method')
            ->get()
            ->pluck('count', 'payment_method');

        // Get daily trends for the period
        $dailyTrends = $query->clone()
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('count(*) as order_count'),
                DB::raw('sum(total) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Get top products (via order items)
        $topProducts = OrderItem::whereIn('order_id', $query->clone()->pluck('id'))
            ->select(
                'product_id',
                DB::raw('sum(qty) as total_quantity'),
                DB::raw('sum(price * qty) as total_revenue')
            )
            ->with('product:id,name')
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        return [
            'period' => $period,
            'start_date' => $period === 'custom' ? $start_date : null,
            'end_date' => $period === 'custom' ? $end_date : null,
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'paid_revenue' => $paidRevenue,
            'pending_revenue' => round($pendingRevenue, 2),
            'status_distribution' => $statusDistribution,
            'payment_method_distribution' => $paymentMethodDistribution,
            'daily_trends' => $dailyTrends,
            'top_products' => $topProducts,
        ];
    }
}
