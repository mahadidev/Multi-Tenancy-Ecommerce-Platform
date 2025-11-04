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
    public function show(Request $request, $vendorId): JsonResponse
    {
        $storeId = authStore();
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }
        
        // Find the vendor manually
        $vendor = Vendor::find($vendorId);
        
        if (!$vendor) {
            return response()->json([
                'status' => 404,
                'message' => 'Vendor not found',
            ], 404);
        }
        
        // Check if user is store owner - owners have full access
        $store = \App\Modules\StoreManagement\Models\Store::find($storeId);
        $isStoreOwner = $store && $store->owner_id === auth()->id();
        
        // Ensure vendor belongs to current store (unless user is store owner)
        if (!$isStoreOwner && $vendor->store_id !== $storeId) {
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
    public function update(UpdateVendorRequest $request, $vendorId): JsonResponse
    {
        $storeId = authStore();
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }
        
        // Find the vendor manually
        $vendor = Vendor::find($vendorId);
        
        if (!$vendor) {
            return response()->json([
                'status' => 404,
                'message' => 'Vendor not found',
            ], 404);
        }
        
        // Debug logging
        \Log::info('Vendor Update Debug', [
            'vendor_id' => $vendor->id,
            'vendor_store_id' => $vendor->store_id,
            'current_store_id' => $storeId,
            'vendor_exists' => !!$vendor,
            'request_data' => $request->validated()
        ]);
        
        // Check if user is store owner - owners have full access
        $store = \App\Modules\StoreManagement\Models\Store::find($storeId);
        $isStoreOwner = $store && $store->owner_id === auth()->id();
        
        // Ensure vendor belongs to current store (unless user is store owner)
        if (!$isStoreOwner && $vendor->store_id !== $storeId) {
            return response()->json([
                'status' => 403,
                'message' => 'Access denied to this vendor',
            ], 403);
        }

        $vendor->update($request->validated());
        
        // Refresh the vendor and load relationships
        $vendor->refresh();
        $vendor->load(['store']);
        
        \Log::info('Vendor After Update', [
            'vendor_id' => $vendor->id,
            'vendor_store_id' => $vendor->store_id,
            'current_store_id' => $storeId,
            'store_loaded' => !!$vendor->store
        ]);

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
    public function destroy(Request $request, $vendorId): JsonResponse
    {
        $storeId = authStore();
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }
        
        // Find the vendor manually
        $vendor = Vendor::find($vendorId);
        
        if (!$vendor) {
            return response()->json([
                'status' => 404,
                'message' => 'Vendor not found',
            ], 404);
        }
        
        // Check if user is store owner - owners have full access
        $store = \App\Modules\StoreManagement\Models\Store::find($storeId);
        $isStoreOwner = $store && $store->owner_id === auth()->id();
        
        // Ensure vendor belongs to current store (unless user is store owner)
        if (!$isStoreOwner && $vendor->store_id !== $storeId) {
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