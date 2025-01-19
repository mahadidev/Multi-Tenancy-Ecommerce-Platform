<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {

        return apiResponse(function () use ($request) {
            return response()->json([
                'status' => 200,
                'data' => ProductService::index($request),
                'meta' => [
                    'current_page' => ProductService::index($request)->currentPage(),
                    'first_page_url' => ProductService::index($request)->url(1),
                    'last_page' => ProductService::index($request)->lastPage(),
                    'last_page_url' => ProductService::index($request)->url(ProductService::index($request)->lastPage()),
                    'next_page_url' => ProductService::index($request)->nextPageUrl(),
                    'prev_page_url' => ProductService::index($request)->previousPageUrl(),
                    'total' => ProductService::index($request)->total(),
                    'per_page' => ProductService::index($request)->perPage(),
                ]
            ]);
        });
    }

    public function show(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $product = ProductService::show($request, $id);
            if ($product == null) {
                return response()->json([
                    'status' => 404,
                    'message' => "product not found",
                    'data' => $product,
                ], 404);
            } else {
                return response()->json([
                    'status' => 200,
                    'data' => $product,
                ]);
            }
        });

    }

    public function store(Request $request)
    {
        return apiResponse(function () use ($request) {
            return response()->json([
                'status' => 200,
                'message' => "product created successfully",
                'product' => ProductService::store($request)
            ]);
        });
    }

    public function update(Request $request, $id)
    {
        return apiResponse(function () use ($request, $id) {
            $product = ProductService::update($request, $id);
            if ($product == null) {
                return response()->json([
                    'status' => 404,
                    'message' => "product not found",
                    'data' => $product,
                ], 404);
            } else {
                return response()->json([
                    'status' => 200,
                    'message' => "product updated successfully",
                    'data' => $product,
                ]);
            }
        });
    }

    public function destroy(Request $request, $id)
    {

        return apiResponse(function () use ($request, $id) {
            $product = ProductService::destroy($request, $id);
            if ($product == null) {
                return response()->json([
                    'status' => 404,
                    'message' => "product not found",
                    'data' => $product,
                ], 404);
            } else {
                return response()->json([
                    'status' => 200,
                    'message' => "product deleted successfully",
                    'data' => $product,
                ]);
            }
        });
    }


}
