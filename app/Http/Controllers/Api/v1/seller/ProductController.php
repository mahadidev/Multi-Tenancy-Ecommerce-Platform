<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request){

        return apiResponse(function () use ($request) {
            return response()->json([
                'products' => ProductService::index($request)
            ]);
        });
    }

    public function show(Request $request, $id){

        return apiResponse(function () use ($request, $id) {
            return response()->json([
                'product' => ProductService::show($request, $id)
            ]);
        });

    }

    public function store(Request $request){
        return apiResponse(function () use ($request) {
            return response()->json([
                'product' => ProductService::store($request)
            ]);
        });
    }
   
    public function update(Request $request, $id){
        return apiResponse(function () use ($request, $id) {
            return response()->json([
                'product' => ProductService::update($request, $id)
            ]);
        });
    }

    public function destroy(Request $request, $id){

        return apiResponse(function () use ($request, $id) {
            return response()->json([
                'message' => ProductService::destroy($request, $id)
            ]);
        });
    }

   
}
