<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductCalculatorService;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function productcalculator(Product $product){
        $productCalculator = new ProductCalculatorService();
        $products = Product::with('variants.options')->get();

        return $productCalculator->calculateStocks($products);
    }
}
