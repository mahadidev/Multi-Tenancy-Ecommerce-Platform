<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Models\Theme;
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
        $user = auth()->user();
        $stores = Store::where(["owner_id" => $user->id])->latest()->get();
        $storeSession = $user->storeSession()->first();
        $current_store = null;

        if ($storeSession) {
            // remove previous store id from session
            $request->session()->forget('store_id');
            if (session()->has('store_id')) {
                session()->forget('store_id');
            }

            // store the store id in session
            session(['store_id' => $storeSession->id]);

            // Also set it in the request attributes
            $request->attributes->set('store_id', $storeSession->store_id);

            // find the store
            $current_store = Store::find($storeSession->store_id);
        }

        if (!$storeSession) {
            $current_store = Store::where('owner_id', $user->id)->first();

            if ($current_store) {
                StoreSession::updateOrCreate([
                    'user_id' => $user->id,
                ], [
                    'store_id' => $current_store->id,
                ]);

                $request->session()->forget('store_id');
                if (session()->has('store_id')) {
                    session()->forget('store_id');
                }

                // store the store id in session
                session(['store_id' => $current_store->id]);

                // Also set it in the request attributes
                $request->attributes->set('store_id', $current_store->id);

            }

        }


        // Return success response
        return response()->json([
            'status' => 200,
            'data' => [
                'stores' => StoreResource::collection($stores),
                'current_store' => $current_store ? new StoreResource($current_store) : null,
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
            'logo_url' => 'nullable|string|max:255',
            'dark_logo' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
            'dark_logo_url' => 'nullable|string|max:255',
            'settings' => 'nullable|array',
            'type' => 'nullable|string',
            "theme_id" => "nullable|exists:themes,id",
            'description' => 'nullable|string',
        ]);


        // Handle the logo file upload if present
        $logoPath = null;
        if ($request->hasFile('logo') && isset($request->logo)) {
            $logoPath = $request->file('logo')->store('stores', 'public');
        } else if ($request->logo_url) {
            $logoPath = $request->logo_url;
        }

        $darkLogoPath = null;
        if ($request->hasFile('dark_logo') && isset($request->dark_logo)) {
            $darkLogoPath = $request->file('dark_logo')->store('stores', 'public');
        } else if ($request->dark_logo_url) {
            $darkLogoPath = $request->dark_logo_url;
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
            'currency' => $request->currency ?? 'BDT',
            'logo' => $logoPath,
            "theme_id" => $theme_id ?? Theme::first()->id,
            'dark_logo' => $darkLogoPath,
            'status' => $request->status ?? 1,
            'settings' => $request->settings ?? null,
            'type' => $request->type ?? null,
            'description' => $request->description ?? null,
        ]);


        // update store session
        $this->updateStoreSession($request, $store);

        // Return success response
        return response()->json([
            'status' => 200,
            'message' => 'Store created successfully.',
            'data' => new StoreResource($store),
        ]);
    }

    public function update(Request $request, $id)
    {
        // Find the store by ID
        // $store = Store::storeOwner()->active()->find($id);
        $store = Store::storeOwner()->find($id);

        if (!$store) {
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
            'logo_url' => 'nullable|string|max:255',
            'dark_logo' => 'nullable|image|mimes:jpeg,png,jpg|max:10048',
            'dark_logo_url' => 'nullable|string|max:255',
            'primary_color' => 'nullable|string|max:255',
            'secondary_color' => 'nullable|string|max:255',
            'settings' => 'nullable|array|max:1000000',
            "theme_id" => "nullable",
            'type' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        // Handle the logo file upload if present
        $logoPath = null;
        if ($request->hasFile('logo') && isset($request->logo)) {
            $logoPath = $request->file('logo')->store('stores', 'public');
        } else if ($request->logo_url) {
            $logoPath = $request->logo_url;
        }

        $darkLogoPath = null;
        if ($request->hasFile('dark_logo') && isset($request->dark_logo)) {
            $darkLogoPath = $request->file('dark_logo')->store('stores', 'public');
        } else if ($request->dark_logo_url) {
            $darkLogoPath = $request->dark_logo_url;
        }

        $theme_id = $store->theme_id;
        if ($request->theme_id) {
            $theme = Theme::where("id", $request->theme_id)->first();

            if ($theme = Theme::where("id", $request->theme_id)->first()) {
                $theme_id = $theme->id;
            } else {
                $theme_id = null;
            }
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
            'primary_color' => $request->primary_color ?? $store->primary_color,
            'secondary_color' => $request->secondary_color ?? $store->secondary_color,
            'theme_id' => $theme_id,
            'settings' => $request->settings ? json_encode($request->settings) : $store->settings,
            'type' => $request->type ?? $store->type,
            'description' => $request->description ?? $store->description,
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
            ], 403);
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
        $store = Store::storeOwner()->active()->find($request->store_id);

        if (!$store) {
            return response()->json([
                'status' => 400,
                'message' => 'Invalid store id'
            ]);
        }

        // update store_id in store_session table
        StoreSession::updateOrCreate([
            'user_id' => auth()->user()->id,
        ], [
            'store_id' => $store->id,
        ]);

        // Check if a store_id exists in the session and remove it
        $request->session()->forget('store_id');
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
        $user = auth()->user();
        $store = Store::where('id', $user->storeSession->store_id)->first();

        return response()->json([
            'status' => 200,
            'data' => [
                'store' => new StoreResource($store)
            ]

        ]);
    }

    public function updateStoreSession(Request $request, $store): void
    {
        // // update store_id in store_session table
        $storeSession = StoreSession::updateOrCreate([
            'user_id' => auth()->user()->id,
        ], [
            'store_id' => $store->id,
        ]);

        // Check if a store_id exists in the session and remove it
        if (session()->has('store_id')) {
            session()->forget('store_id');
        }

        // Store the new `store_id` in the session
        session(['store_id' => $store->id]);

        // Also set it in the request attributes
        $request->attributes->set('store_id', $store->id);

    }
}
