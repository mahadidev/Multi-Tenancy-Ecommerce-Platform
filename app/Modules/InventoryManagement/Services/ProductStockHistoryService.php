<?php

namespace App\Modules\InventoryManagement\Services;

use App\Http\Resources\ProductStockHistoryResource;
use App\Http\Resources\ProductStockResource;
use App\Modules\ProductManagement\Models\Product;
use App\Modules\InventoryManagement\Models\ProductStock;
use App\Modules\InventoryManagement\Models\ProductStockHistory;
use App\Modules\InventoryManagement\Models\ProductStockItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProductStockHistoryService
{
    // Create a new Product Stock History
    public function createStockHistory(Product $product, ProductStock $stock, $history)
    {
        // validate history
        $history = is_array($history) ? $history : $history->toArray(); // handle both array and object
        $validator = Validator::make(
            $history,
            [
                'type' => 'required|in:added,edited,deleted',
                'note' => 'nullable|string'
            ]
        );
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        // validate stock
        $this->validateStock($product, $stock);
        $productStockExists = ProductStock::where('id', $stock->id)->exists();

        $productStockHistory = ProductStockHistory::create([
            'product_id' => $product->id,
            'product_stock_id' => $productStockExists ? $stock->id : null,
            'qty' => $stock->qty,
            'price' => $stock->price,
            'buying_price' => $stock->buying_price,
            'discount_amount' => $stock->discount_amount,
            'tax' => $stock->tax,
            'note' => $history["note"] ?? $stock->note,
            'type' => $history["type"] ?? "added"
        ]);

        return new ProductStockHistoryResource($productStockHistory);
    }

    // Update an existing Product Stock
    public function updateStockHistory(Product $product, $stockData, ProductStockHistory $stockHistory)
    {
        $this->validateStock($product, $stockData);

        // Update stock fields
        $stockHistory->update([
            'price' => $stockData['price'] ?? $stockHistory["price"],
            'buying_price' => $stockData['buying_price'] ?? $stockHistory["buying_price"],
            'discount_amount' => $stockData['discount_amount'] ?? $stockHistory["discount_amount"],
            'tax' => $stockData['tax'] ?? $stockHistory["tax"],
            'note' => $stockData['note'] ?? $stockHistory["note"],
            'qty' => $stockData['qty'] ?? $stockHistory["qty"],
        ]);

        return new ProductStockHistoryResource($stockHistory);
    }

    // Delete Product Stock
    public function deleteStockHistory(Product $product, ProductStockHistory $stockHistory)
    {
        $stockHistory = ProductStockHistory::where('id', $stockHistory->id)
            ->firstOrFail();

        $stockHistory->delete();

        return response()->json([
            'message' => 'Product stock history deleted successfully.',
        ]);
    }

    // Validate the stock information
    protected function validateStock(Product $product, $stock)
    {
        $stockData = is_array($stock) ? $stock : $stock->toArray(); // handle both array and object

        $validator = Validator::make(
            $stockData,
            [
                'price' => 'nullable|numeric|min:0',
                'buying_price' => 'nullable|numeric|min:0',
                'discount_amount' => 'nullable|numeric|min:0',
                'tax' => 'nullable|numeric|min:0',
                'note' => 'nullable|string|max:255',
                'qty' => 'nullable|integer|min:0',
            ]
        );

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        if (isset($stockData['product_id']) && $stockData['product_id'] != $product->id) {
            throw ValidationException::withMessages([
                'product_id' => ['The provided product_id does not match the expected product.'],
            ]);
        }
    }


    // Generate a unique SKU
    protected function generateUniqueSku(): string
    {
        do {
            $sku = 'SKU-' . strtoupper(uniqid());
        } while (ProductStock::where('sku', $sku)->exists());

        return $sku;
    }

    // summary
    public function getStockHistorySummary(string $range = 'month'): array
    {
        $query = ProductStockHistory::query()->where(["type" => "added"]);

        // Define the time range
        switch ($range) {
            case 'today':
                $start = Carbon::today();
                $end = Carbon::tomorrow();
                $format = 'H:i';
                break;

            case 'week':
                $start = Carbon::now()->subDays(6)->startOfDay();
                $end = Carbon::now()->endOfDay();
                $format = 'l'; // Monday, Tuesday...
                break;

            case 'month':
                $start = Carbon::now()->startOfMonth();
                $end = Carbon::now()->endOfMonth();
                $format = 'd'; // Day of the month
                break;

            case 'year':
                $start = Carbon::now()->startOfYear();
                $end = Carbon::now()->endOfYear();
                $format = 'F'; // January, February...
                break;

            default:
                throw new \InvalidArgumentException("Invalid date range: $range");
        }

        // Fetch and group data
        $histories = $query->whereBetween('created_at', [$start, $end])
            ->get()
            ->groupBy(fn($item) => $item->created_at->format($format))
            ->map(fn($group) => [
                'qty' => $group->sum('qty'),
                'total_value' => $group->sum(fn($item) => $item->qty * $item->buying_price),
            ])
            ->toArray();

        return $histories;
    }
}
