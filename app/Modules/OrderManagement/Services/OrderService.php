<?php

namespace App\Modules\OrderManagement\Services;

use App\Http\Resources\ProductResource;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Modules\InventoryManagement\Models\ProductStock;
use App\Models\Store;
use App\Exceptions\OrderProcessingException;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
        } catch (OrderProcessingException $e) {
            DB::rollBack();
            throw $e;
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
            'is_payed' => 'nullable|boolean',
            'is_approved' => 'nullable|boolean',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.stock_id' => 'required|exists:product_stocks,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.custom_price' => 'nullable|numeric|min:0',
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
            'is_payed' => $data['is_payed'] ?? false,
            'is_approved' => $data['is_approved'] ?? false,
            'total' => 0,
            'status' => $data['status'] ?? 'completed',
        ]);
    }

    /**
     * Process all order items
     *
     * @param Order $order
     * @param array $items
     * @param int $storeId
     * @throws OrderProcessingException
     */
    protected function processOrderItems(Order $order, array $items, int $storeId): void
    {
        foreach ($items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $stock = ProductStock::where('id', $item["stock_id"])->first();

            if ($stock->qty < $item['qty']) {
                throw new OrderProcessingException("Not enough stock for product: {$product->name}. Available: {$stock->qty}, Requested: {$item['qty']}");
            }

            $this->createOrderItem($order, $product, $item, $storeId);
            $product->decrement('stock', $item["qty"]);
        }
    }

    protected function createOrderItem(Order $order, Product $product, array $itemData, int $storeId): OrderItem
    {
        $discount = (float) ($itemData['discount_amount'] ?? 0);
        $quantity = (int) $itemData['qty'];
        $taxRate = (float) ($itemData['tax'] ?? 0);

        $unitPrice = $product->price;
        $price = $unitPrice * $quantity;
        $discountedPrice = $price - $discount;
        $taxAmount = ($unitPrice * $taxRate / 100) * $quantity;
        $total = $discountedPrice + $taxAmount;

        $stock = ProductStock::where('id', $itemData["stock_id"])->first();

        $title = $product->name;
        foreach ($stock->items as $item) {
            $title .= " " . $item->variantOption->label;
        }

        $stock->update(["qty" => $stock->qty - $quantity]);

        return OrderItem::create([
            'order_id' => $order->id,
            'user_id' => null,
            'product_id' => $product->id,
            'store_id' => $storeId,
            'item' => $title,
            'qty' => $quantity,
            'price' => $price,
            'total' => $total,
            'discount_price' => $discountedPrice,
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

    // ---------------------- REPORTING -----------------------

    /**
     * Get Order Report
     *
     * @return array<string, mixed>
     */
    public function getOrderReport(string $period = 'last30days', ?string $start_date = null, ?string $end_date = null): array
    {
        [$start, $end] = $this->getDateRange($period, $start_date, $end_date);
        $storeId = $this->getStoreId();

        $metrics = $this->getOrderMetrics($storeId, $start, $end);
        $orderItems = $this->getOrderItems($storeId, $start, $end);
        $products = $this->getProducts($orderItems);

        return [
            'period' => $period,
            'start_date' => $period === 'custom' ? $start_date : null,
            'end_date' => $period === 'custom' ? $end_date : null,
            ...$metrics,
            'daily_trends' => $this->getDailyTrends($storeId, $start, $end, $orderItems, $products),
            'chartSeries' => $this->getChartSeries($orderItems, $products, $period),
            'top_products' => $this->getTopProducts($orderItems, $products),
        ];
    }

    private function getDateRange(string $period, ?string $start_date, ?string $end_date): array
    {
        return match ($period) {
            'today' => [now()->startOfDay(), now()->endOfDay()],
            'last7days' => [now()->subDays(6)->startOfDay(), now()->endOfDay()],
            'last30days' => [now()->subDays(29)->startOfDay(), now()->endOfDay()],
            'last1year' => [now()->subYear()->startOfDay(), now()->endOfDay()],
            'custom' => [Carbon::parse($start_date)->startOfDay(), Carbon::parse($end_date)->endOfDay()],
            default => [now()->subDays(6)->startOfDay(), now()->endOfDay()],
        };
    }

    private function getOrderMetrics(int $storeId, $start, $end): array
    {
        $ordersQuery = DB::table('orders')->where('store_id', $storeId)
            ->whereBetween('created_at', [$start, $end]);

        return [
            'total_orders' => $ordersQuery->count(),
            'total_revenue' => $ordersQuery->sum('total'),
            'paid_revenue' => (clone $ordersQuery)->where('is_payed', true)->sum('total'),
            'pending_revenue' => round((clone $ordersQuery)->where('is_payed', false)->sum('total'), 2),
            'status_distribution' => (clone $ordersQuery)
                ->select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status'),
            'payment_method_distribution' => (clone $ordersQuery)
                ->select('payment_method', DB::raw('COUNT(*) as count'))
                ->groupBy('payment_method')
                ->pluck('count', 'payment_method'),
        ];
    }

    private function getOrderItems(int $storeId, $start, $end): Collection
    {
        return DB::table('order_items')
            ->whereIn('order_id', function ($q) use ($storeId, $start, $end) {
                $q->select('id')->from('orders')
                    ->where('store_id', $storeId)
                    ->whereBetween('created_at', [$start, $end]);
            })->get();
    }

    private function getProducts(Collection $orderItems): Collection
    {
        $productIds = $orderItems->pluck('product_id')->unique();
        return Product::with(['category', 'brand', 'variants', 'stocks', 'store'])
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');
    }

    private function getDailyTrends(int $storeId, $start, $end, Collection $orderItems, Collection $products): Collection
    {
        return DB::table('orders')
            ->leftJoin('order_items', 'orders.id', '=', 'order_items.order_id')
            ->selectRaw('DATE(orders.created_at) as date, COUNT(DISTINCT orders.id) as order_count, SUM(orders.total) as revenue, COALESCE(SUM(order_items.qty), 0) as product_qty')
            ->where('orders.store_id', $storeId)
            ->whereBetween('orders.created_at', [$start, $end])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($trend) use ($orderItems, $products) {
                $itemsForDate = $orderItems->filter(fn($item) => Carbon::parse($item->created_at)->format('Y-m-d') === $trend->date);
                $productIdsForDate = $itemsForDate->pluck('product_id')->unique();
                $productsForDate = $products->only($productIdsForDate->toArray())->values();

                return [
                    'date' => $trend->date,
                    'order_count' => $trend->order_count,
                    'revenue' => $trend->revenue,
                    'product_qty' => $trend->product_qty,
                    'products' => ProductResource::collection($productsForDate),
                ];
            });
    }

    private function getChartSeries(Collection $orderItems, Collection $products, string $period): Collection
    {
        return $orderItems->groupBy(function ($item) use ($period) {
            $createdAt = Carbon::parse($item->created_at);
            return match ($period) {
                'today' => $createdAt->format('H:i'),
                'week' => $createdAt->format('l'),
                'month' => $createdAt->format('d'),
                'year' => $createdAt->format('F'),
                default => $createdAt->format('Y-m-d'),
            };
        })->map(function ($group) use ($products) {
            $productIdsInGroup = $group->pluck('product_id')->unique();
            $productsInGroup = $products->only($productIdsInGroup->toArray())->values();

            return [
                'order_count' => $group->pluck('order_id')->unique()->count(),
                'revenue' => $group->sum(fn($item) => $item->discount_price ?: $item->price),
                'profit' => $group->sum(function ($item) use ($products) {
                    $sellingPrice = $item->discount_price ?: $item->price;
                    $perUnitPrice = $sellingPrice / $item->qty;
                    $buyingPrice = $products[$item->product_id]->buying_price ?? 0;
                    return ($perUnitPrice - $buyingPrice) * $item->qty;
                }),
                'products' => ProductResource::collection($productsInGroup),
                'product_qty' => $group->sum('qty'),
            ];
        });
    }

    private function getTopProducts(Collection $orderItems, Collection $products): Collection
    {
        return $orderItems->groupBy('product_id')
            ->map(function ($items) use ($products) {
                $product = $products[$items->first()->product_id] ?? null;
                return [
                    'product' => $product ? new ProductResource($product) : null,
                    'total_quantity' => $items->sum('qty'),
                    'total_revenue' => $items->sum(fn($i) => ($i->discount_price ?: $i->price) * $i->qty),
                ];
            })
            ->sortByDesc('total_quantity')
            ->take(5)
            ->values();
    }
}
