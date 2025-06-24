<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductCreateHistory;

class ProductHistoryService
{
    /**
     * Create a history record when a new product is created
     *
     * @param Product $product The product that was created
     * @param array $additionalData Additional data to store in history
     * @return ProductCreateHistory
     */
    public function recordProductCreation(Product $product, array $additionalData = []): ProductCreateHistory
    {
        $historyData = [
            'product_id' => $product->id,
            'qty' => $product->qty ?? 0,
            'price' => $product->price ?? 0,
            'discount_amount' => $product->discount_amount ?? 0,
            'buying_price' => $product->buying_price ?? 0,
            'tax' => $product->tax ?? 0,
            'note' => 'Product initially created'
        ];

        // Merge with any additional data passed
        $historyData = array_merge($historyData, $additionalData);

        return ProductCreateHistory::create($historyData);
    }
}
