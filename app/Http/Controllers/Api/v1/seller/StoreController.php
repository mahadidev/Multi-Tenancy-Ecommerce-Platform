<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\StoreSession;
use App\Services\StoreService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;


class StoreController extends Controller
{
    public function index(Request $request)
    {
        $stores = Store::storeOwner()->active()->latest()->get();


        // Return success response
        return response()->json([
            'status' => 200,
            'data' => [
                'stores' => StoreResource::collection($stores),
            ]
        ]);


    }

    public function show(Request $request, $id)
    {

        try {
            $store = Store::storeOwner()->active()->findorfail($id);

            return response()->json([
                'status' => 200,
                'data' => [
                    'store' => new StoreResource($store),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Invalid store id',
            ], 404);
        }
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:25|unique:stores|regex:/^[a-zA-Z0-9\-]+$/',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'currency' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
            'dark_logo' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
            'settings' => 'nullable|array',
        ]);


        // Handle the logo file upload if present
        $logoPath = null;
        if ($request->hasFile('logo') && isset($request->logo)) {
            $logoPath = $request->file('logo')->store('stores', 'public');
        }

        $darkLogoPath = null;
        if ($request->hasFile('dark_logo') && isset($request->dark_logo)) {
            $darkLogoPath = $request->file('dark_logo')->store('stores', 'public');
        }


        // Create a new store record
        $store = Store::create([
            'owner_id' => auth()->user()->id,
            'name' => $request->name,
            'slug' => $request->slug,
            'domain' => $request->domain ?? null,
            'email' => $request->email ?? null,
            'phone' => $request->phone ?? null,
            'location' => $request->location ?? null,
            // 'currency' => $request->currency ?? null,
            'logo' => $logoPath,
            'dark_logo' => $darkLogoPath,
            'status' => $request->status ?? 1,
            'settings' => $request->settings ?? null
        ]);

        // Return success response
        return response()->json([
            'status' => 200,
            'message' => 'Store created successfully.',
            'data' => new StoreResource($store),
        ]);
    }

    public function updateByPost(Request $request, $id)
    {
        // Find the store by ID
        $store = Store::storeOwner()->active()->find($id);

        if(!$store){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store id'
            ]);
        }
        
        // Validate the incoming request data
        $request->validate([
            'name' => 'nullable|string|max:255',
            'domain' => 'nullable|string|max:25|regex:/^[a-zA-Z0-9\-]+$/|unique:stores,domain,' . $store->id, // Ignore the current store's domain
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'currency' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
            'dark_logo' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
            'settings' => 'nullable|array',
        ]);

        // Handle the logo file upload if present
        $logoPath = null;
        if ($request->hasFile('logo') && isset($request->logo)) {
            $logoPath = $request->file('logo')->store('stores', 'public');
        }

        $darkLogoPath = null;
        if ($request->hasFile('dark_logo') && isset($request->dark_logo)) {
            $darkLogoPath = $request->file('dark_logo')->store('stores', 'public');
        }

        // Update the store record
        $store->update([
            'name' => $request->name ?? $store->name,
            'domain' => $request->domain ?? $store->domain,
            'email' => $request->email ?? $store->email,
            'phone' => $request->phone ?? $store->phone,
            'location' => $request->location ?? $store->location,
            'currency' => $request->currency ?? $store->currency,
            'status' => $request->status ?? $store->status, // Retain the existing status if not provided
            'logo' => $logoPath ?? $store->logo,
            'dark_logo' => $darkLogoPath ?? $store->dark_logo,
            'settings' => $request->settings ?? $store->settings
        ]);

        // Return success response
        return response()->json([
            'status' => 200,
            'message' => 'Store updated successfully.',
            'data' => new StoreResource($store),
        ], 200);
    }

    public function update(Request $request, $id)
    {
        // Find the store by ID
        $store = Store::storeOwner()->active()->find($id);

        if(!$store){
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store id'
            ]);
        }

        // Validate the incoming request data
        $request->validate([
            'name' => 'nullable|string|max:255',
            'domain' => 'nullable|string|max:25|regex:/^[a-zA-Z0-9\-]+$/|unique:stores,domain,' . $store->id, // Ignore the current store's domain
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'currency' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
            'dark_logo' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
            'settings' => 'nullable|array',
        ]);

        // Handle the logo file upload if present
        $logoPath = null;
        if ($request->hasFile('logo') && isset($request->logo)) {
            $logoPath = $request->file('logo')->store('stores', 'public');
        }

        $darkLogoPath = null;
        if ($request->hasFile('dark_logo') && isset($request->dark_logo)) {
            $darkLogoPath = $request->file('dark_logo')->store('stores', 'public');
        }

        // Update the store record
        $store->update([
            'name' => $request->name ?? $store->name,
            'domain' => $request->domain ?? $store->domain,
            'email' => $request->email ?? $store->email,
            'phone' => $request->phone ?? $store->phone,
            'location' => $request->location ?? $store->location,
            'currency' => $request->currency ?? $store->currency,
            'status' => $request->status ?? $store->status, // Retain the existing status if not provided
            'logo' => $logoPath ?? $store->logo,
            'dark_logo' => $darkLogoPath ?? $store->dark_logo,
            'settings' => $request->settings ?? $store->settings
        ]);

        // Return success response
        return response()->json([
            'status' => 200,
            'message' => 'Store updated successfully.',
            'data' => new StoreResource($store),
        ], 200);
    }

    public function destroy($id)
    {
        // Find the store owned by the authenticated user
        $store = Store::storeOwner()->active()->find($id);

        // If the store doesn't exist or is not owned by the user, return an error
        if (!$store) {
            return response()->json([
                'status' => 403,
                'message' => 'You are not authorized to delete this store or it does not exist.',
            ],403); 
        }

        // Delete the store record
        $store->delete();

        // Return success response
        return response()->json([
            'status' => 200,
            'message' => 'Store deleted successfully.',
        ]);
    }

    public function switchStore(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'store_id' => 'required|int|exists:stores,id',
        ]);

        // Retrieve the store and ensure it belongs to the authenticated user and is active
        $store = Store::storeOwner()->active()->findOrFail($request->store_id);

        // // update store_id in store_session table
        StoreSession::updateOrCreate([
            'user_id' => auth()->user()->id,
        ], [
            'store_id' => $store->id,
        ]);

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
            'status' => 200,
            'message' => 'Store switched successfully.',
            'data' => [
                'store' => new StoreResource($store),
            ]
        ]);
    }

    public function currentStore(Request $request)
    {

        // Retrieve store_id from session or request attributes
        $storeId = authStore();
        $store = Store::find($storeId);

        if (!$store) {
            return response()->json([
                'error' => 'Currently no store is selected!',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'store' => new StoreResource($store)
            ]

        ]);
    }

}
