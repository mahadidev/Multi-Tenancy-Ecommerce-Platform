<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request){

        $products = ProductService::index($request);

        return response()->json([
            'products' => ProductResource::collection($products),
        ]);
    }

    public function show(Request $request, $id){

        try {
            
            $product = Product::findorfail($id);

            return response()->json([
                'store' => new ProductResource($product),
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'data not found',
            ], 404);
        }
    }
}
