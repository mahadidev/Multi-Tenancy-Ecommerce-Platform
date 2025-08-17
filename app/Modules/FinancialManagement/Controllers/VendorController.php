<?php

namespace App\Modules\FinancialManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\FinancialManagement\Models\Vendor;
use App\Modules\FinancialManagement\Requests\StoreVendorRequest;
use App\Modules\FinancialManagement\Requests\UpdateVendorRequest;
use App\Modules\FinancialManagement\Resources\VendorResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Display a listing of vendors
     */
    public function index(Request $request): JsonResponse
    {
        $storeId = authStore();
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }
        
        $vendors = Vendor::forStore($storeId)
            ->with(['store'])
            ->orderBy('name')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 200,
            'message' => 'Vendors retrieved successfully',
            'data' => [
                'vendors' => VendorResource::collection($vendors->items()),
            ],
            'meta' => [
                'current_page' => $vendors->currentPage(),
                'first_page_url' => $vendors->url(1),
                'last_page' => $vendors->lastPage(),
                'last_page_url' => $vendors->url($vendors->lastPage()),
                'next_page_url' => $vendors->nextPageUrl(),
                'prev_page_url' => $vendors->previousPageUrl(),
                'total' => $vendors->total(),
                'per_page' => $vendors->perPage(),
            ],
        ]);
    }

    /**
     * Store a newly created vendor
     */
    public function store(StoreVendorRequest $request): JsonResponse
    {
        $storeId = authStore();
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }
        
        $vendor = Vendor::create([
            ...$request->validated(),
            'store_id' => $storeId,
        ]);

        $vendor->load(['store']);

        return response()->json([
            'status' => 200,
            'message' => 'Vendor created successfully',
            'data' => [
                'vendor' => new VendorResource($vendor),
            ],
        ], 201);
    }

    /**
     * Display the specified vendor
     */
    public function show(Request $request, Vendor $vendor): JsonResponse
    {
        $storeId = authStore();
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }
        
        // Ensure vendor belongs to current store
        if ($vendor->store_id !== $storeId) {
            return response()->json([
                'status' => 403,
                'message' => 'Access denied to this vendor',
            ], 403);
        }

        $vendor->load(['store']);

        return response()->json([
            'status' => 200,
            'message' => 'Vendor retrieved successfully',
            'data' => [
                'vendor' => new VendorResource($vendor),
            ],
        ]);
    }

    /**
     * Update the specified vendor
     */
    public function update(UpdateVendorRequest $request, Vendor $vendor): JsonResponse
    {
        $storeId = authStore();
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }
        
        // Ensure vendor belongs to current store
        if ($vendor->store_id !== $storeId) {
            return response()->json([
                'status' => 403,
                'message' => 'Access denied to this vendor',
            ], 403);
        }

        $vendor->update($request->validated());
        $vendor->load(['store']);

        return response()->json([
            'status' => 200,
            'message' => 'Vendor updated successfully',
            'data' => [
                'vendor' => new VendorResource($vendor),
            ],
        ]);
    }

    /**
     * Remove the specified vendor
     */
    public function destroy(Request $request, Vendor $vendor): JsonResponse
    {
        $storeId = authStore();
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }
        
        // Ensure vendor belongs to current store
        if ($vendor->store_id !== $storeId) {
            return response()->json([
                'status' => 403,
                'message' => 'Access denied to this vendor',
            ], 403);
        }

        $vendor->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Vendor deleted successfully',
        ]);
    }
}