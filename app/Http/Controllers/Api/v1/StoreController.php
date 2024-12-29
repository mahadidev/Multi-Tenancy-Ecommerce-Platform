<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use Illuminate\Http\Request;
use App\Models\Store;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;


class StoreController extends Controller
{
    public function index(Request $request){
        $stores = Store::storeOwner()->active()->latest()->get();

        return response()->json([
            'stores' => StoreResource::collection($stores),
        ]);
    }

    public function show(Request $request, $id){
        
        try {
            $store = Store::storeOwner()->active()->findorfail($id);
            return response()->json([
                'store' => new StoreResource($store),
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'data not found',
            ], 404);
        }
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'name'     => 'required|string|max:255',
            'domain'   => 'required|string|max:25|unique:stores|regex:/^[a-zA-Z0-9\-]+$/', 
            'email'    => 'required|email|max:255',
            'phone'    => 'required|string|max:20',
            'location' => 'required|string|max:255',
        ]);

        // Create a new store record
        $store = Store::create([
            'owner_id' => auth()->user()->id,
            'name'     => $request->name,
            'slug'     => $request->slug,
            'domain'   => $request->domain,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'location' => $request->location, 
            'status'   => $request->status ?? 1,
        ]);

        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'Store created successfully.',
            'data'    => $store,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Find the store by ID
        $store = Store::storeOwner()->active()->findOrFail($id);

        // Validate the incoming request data
        $request->validate([
            'name'     => 'required|string|max:255',
            'domain'   => 'nullable|string|max:25|regex:/^[a-zA-Z0-9\-]+$/|unique:stores,domain,' . $store->id, // Ignore the current store's domain
            'email'    => 'required|email|max:255',
            'phone'    => 'required|string|max:20',
            'location' => 'required|string|max:255',
        ]);

        // Update the store record
        $store->update([
            'name'     => $request->name,
            'domain'   => $request->domain ?? $store->domain,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'location' => $request->location,
            'status'   => $request->status ?? $store->status, // Retain the existing status if not provided
        ]);

        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'Store updated successfully.',
            'data'    => $store,
        ], 200);
    }

    public function destroy($id)
    {
        // Find the store owned by the authenticated user
        $store = Store::storeOwner()->active()->findorfail($id);

        // If the store doesn't exist or is not owned by the user, return an error
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to delete this store or it does not exist.',
            ], 403); // Forbidden
        }

        // Delete the store record
        $store->delete();

        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'Store deleted successfully.',
        ], 200);
    }

    public function switchStore(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'store_id' => 'required|int|exists:stores,id',
        ]);

        // Retrieve the store and ensure it belongs to the authenticated user and is active
        $store = Store::storeOwner()->active()->findOrFail($request->store_id);

        // Check if a store_id exists in the session and remove it
        if ($store && session()->has('store_id')) {
            session()->forget('store_id');
        }

        // Store the new `store_id` in the session
        session(['store_id' => $store->id]);

        // Also set it in the request attributes
        $request->attributes->set('store_id', $store->id);

        // Return a success response with the selected store
        return response()->json([
            'message' => 'Store switched successfully.',
            'store' => new StoreResource($store),
        ], 200);
    }

    public function currentStore(Request $request){
        
        // Retrieve store_id from session or request attributes
        $storeId = $request->attributes->get('store_id') ?? session('store_id');
        
        $store = Store::findorfail($storeId);

        return response()->json([
            'store' => new StoreResource($store)
        ]);
    }

}
