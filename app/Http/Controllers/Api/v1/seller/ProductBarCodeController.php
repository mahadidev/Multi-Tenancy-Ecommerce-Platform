<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductBarCodeController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:products,id',
        ]);
        $product = Product::findOrFail($request->id);
        $sku = $product->sku;

        return $product;
    }

}
