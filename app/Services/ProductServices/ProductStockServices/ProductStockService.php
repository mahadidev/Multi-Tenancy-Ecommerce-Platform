<?php

namespace App\Services\ProductServices\ProductStockServices;

use App\Http\Resources\ProductStockResource;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\ProductStockItem;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProductStockService
{
    public $stockHistoryService;

    public function __construct() {
        $this->stockHistoryService = new ProductStockHistoryService();
    }

    // Create a new Product Stock
    public function createStock(Product $product, $stockData)
    {
        $this->validateStock($product, $stockData);

        // Create a new product stock
        $productStock = ProductStock::create([
            'product_id' => $product->id,
            'price' => $stockData['price'] ?? 0,
            'buying_price' => $stockData['buying_price'] ?? 0,
            'discount_amount' => $stockData['discount_amount'] ?? 0,
            'tax' => $stockData['tax'] ?? 0,
            'note' => $stockData['note'] ?? null,
            'qty' => $stockData['qty'] ?? 0,
            'sku' => $stockData['sku'] ?? $this->generateUniqueSku(),
        ]);

        // Add stock items related to the product stock
        if (!empty($stockData['items'])) {
            foreach ($stockData['items'] as $item) {
                ProductStockItem::create([
                    'stock_id' => $productStock->id,
                    'variant_opton_id' => $item['variant_option_id'] ?? null,
                ]);
            }
        }

        // create stock history
        $this->stockHistoryService->createStockHistory($product, $productStock, ["type" => "added"]);

        return new ProductStockResource($productStock);
    }

    // Update an existing Product Stock
    public function updateStock(Product $product, $stockData)
    {
        if (empty($stockData['id'])) {
            throw ValidationException::withMessages([
                'id' => 'Stock ID is missing/invalid for update.',
            ]);
        }

        $this->validateStock($product, $stockData);

        // Find the existing stock
        $productStock = ProductStock::where('product_id', $product->id)
            ->where('id', $stockData['id'])
            ->firstOrFail();
        // old product stock
        $oldProductStock = clone $productStock;

        // Update stock information
        $productStock->update([
            'price' => $stockData['price'] ?? 0,
            'buying_price' => $stockData['buying_price'] ?? 0,
            'discount_amount' => $stockData['discount_amount'] ?? 0,
            'tax' => $stockData['tax'] ?? 0,
            'qty' => $stockData['qty'] ?? 0,
            'note' => $stockData['note'] ?? null,
            'sku' => $stockData['sku'] ?? $this->generateUniqueSku(),
        ]);

        // Delete existing stock items
        $productStock->items()->delete();

        // Recreate stock items
        if (!empty($stockData['items'])) {
            foreach ($stockData['items'] as $item) {
                ProductStockItem::create([
                    'stock_id' => $productStock->id,
                    'variant_opton_id' => $item['variant_option_id'] ?? null,
                ]);
            }
        }

        // create stock history
        $note = $productStock->note;
        if($oldProductStock->qty != (int)$stockData['qty']){
            $note = "Qty changed! from " . $oldProductStock->qty . " to " . $stockData["qty"];
        }

        $this->stockHistoryService->createStockHistory($product, $productStock, ["type" => "edited", "note" => $note]);

        return new ProductStockResource($productStock);
    }

    // Delete Product Stock
    public function deleteStock(Product $product, $stockId)
    {
        // Find and delete the product stock
        $productStock = ProductStock::where('product_id', $product->id)
            ->where('id', $stockId)
            ->firstOrFail();
        $oldProductStock = clone $productStock;

        // Delete associated items
        $productStock->items()->delete();

        // Delete the stock itself
        $productStock->delete();

        // create stock history
        $this->stockHistoryService->createStockHistory($product, $oldProductStock, ["type" => "deleted"]);

        return response()->json([
            'message' => 'Product stock deleted successfully.',
        ]);
    }

    // Validate the stock information
    protected function validateStock(Product $product, $stockData)
    {
        $validator = Validator::make(
            $stockData,
            [
                'price' => 'nullable|numeric|min:0',
                'buying_price' => 'nullable|numeric|min:0',
                'discount_amount' => 'nullable|numeric|min:0',
                'tax' => 'nullable|numeric|min:0',
                'note' => 'nullable|string',
                'qty' => 'nullable|integer|min:0',
                'sku' => 'nullable|string|max:255',
                'items' => 'array',
                'items.*.variant_option_id' => 'nullable|exists:product_variant_options,id',
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

    protected function generateUniqueSku()
    {
        do {
            $sku = 'SKU-' . strtoupper(uniqid()); // You can customize the format
        } while (ProductStock::where('sku', $sku)->exists());

        return $sku;
    }
}

