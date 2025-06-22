<?php

namespace App\Services;

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
            'items.*.variants' => 'nullable|array',
            'items.*.variants.*.label' => 'required_with:items.*.variants|string',
            'items.*.variants.*.value' => 'required_with:items.*.variants|string',
            'items.*.variants.*.price' => 'required_with:items.*.variants|numeric|min:0',
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

            // Check stock availability
            if ($product->stock < $item['qty']) {
                throw new OrderProcessingException("Not enough stock for product: {$product->name}. Available: {$product->stock}, Requested: {$item['qty']}");
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
        $taxRate = (float) ($product['tax'] ?? 0); // Default to 0 if not set

        // Calculate the total price before discount
        $price = $product->price * $quantity;
        $discount_price = ($product->price * $quantity) - $discount;

        return OrderItem::create([
            'order_id' => $order->id,
            'user_id' => null,
            'product_id' => $product->id,
            'store_id' => $storeId,
            'item' => $product->name,
            'qty' => $quantity,
            'price' => $price, // Original unit price
            'discount_price' => $discount_price, // Added discount amount for reference
            'tax' => $taxRate,
            'shop_id' => $product->shop_id,
            'variants' => $itemData['variants'] ?? null,
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
}
