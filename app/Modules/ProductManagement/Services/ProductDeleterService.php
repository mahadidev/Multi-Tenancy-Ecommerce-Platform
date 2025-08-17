<?php

namespace App\Modules\ProductManagement\Services;

use App\Models\Product;

class ProductDeleterService
{
    public function handle($id)
    {
        $product = Product::authorized()->find($id);
        if (!$product) {
            return null;
        }

        $product->delete();

        return 'Product deleted successfully.';
    }
}
