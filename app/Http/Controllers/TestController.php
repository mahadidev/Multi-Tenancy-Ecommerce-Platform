<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function productcalculator(Product $product){
        $products = Product::with('variants.options')->get();

        // TODO: ProductCalculatorService needs to be recreated or refactored
        return response()->json(['message' => 'ProductCalculatorService not available']);
    }
}
