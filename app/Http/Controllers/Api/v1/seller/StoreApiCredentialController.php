<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Models\StoreApiCredential;
use App\Http\Resources\StoreApiCredentialResource;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;

class StoreApiCredentialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $credentials = StoreApiCredential::latest()->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'credentials' => StoreApiCredentialResource::collection($credentials)
            ]
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'provider' => 'required|string',
            'credentials' => 'required|array',
            'status' => 'required|boolean'
        ]);

        $store_id = authStore();

        if (StoreApiCredential::authorized()->where('provider', $request->provider)->exists()) {
            return response()->json([
                'status' => 400,
                'message' => 'Store API credential already exists'
            ], 400);
        }

        $credential = StoreApiCredential::create([
            'store_id' => $store_id,
            'provider' => $request->provider ?? 'steadfast',
            'credentials' => json_encode(Crypt::encrypt($request->credentials)), // Ensure it's properly stored as JSON
            'status' => $request->status ?? 1,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Store API credential created successfully',
            'data' => [
                'credential' => new StoreApiCredentialResource($credential)
            ]
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $storeApiCredential = StoreApiCredential::authorized()->find($id);

        if (!$storeApiCredential) {
            return response()->json([
                'status' => 404,
                'message' => 'Store API credential not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Store API credential retrieved successfully',
            'data' => [
                'credential' => new StoreApiCredentialResource($storeApiCredential)
            ]
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $storeApiCredential = StoreApiCredential::authorized()->find($id);

        if (!$storeApiCredential) {
            return response()->json([
                'status' => 404,
                'message' => 'Store API credential not found'
            ], 404);
        }

        $request->validate([
            'provider' => 'required|string',
            'credentials' => 'required|array',
            'status' => 'required|boolean'
        ]);

        if (StoreApiCredential::authorized()->where('provider', $request->provider)->where('id', '!=', $id)->exists()) {
            return response()->json([
                'status' => 400,
                'message' => 'Store API credential already exists'
            ], 400);
        }

        $storeApiCredential->update([
            'provider' => $request->provider ?? 'steadfast',
            'credentials' => json_encode(Crypt::encrypt($request->credentials)), // Ensure it's properly stored as JSON
            'status' => $request->status
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Store API credential updated successfully',
            'data' => [
                'credential' => new StoreApiCredentialResource($storeApiCredential)
            ]
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $storeApiCredential = StoreApiCredential::authorized()->find($id);

        if (!$storeApiCredential) {
            return response()->json([
                'status' => 404,
                'message' => 'Store API credential not found'
            ], 404);
        }

        $storeApiCredential->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Store API credential deleted successfully'
        ], 200);
    }
}
