<?php

namespace App\Http\Controllers\Api\v1\OnBoarding;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Store;
use App\Models\StoreSession;
use Spatie\Permission\Models\Role;
use App\Http\Resources\UserResource;
use App\Http\Resources\StoreResource;
// use Illuminate\Container\Attributes\Log;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class OnBoardingController extends Controller
{
    public function sellerRegister(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string',
            'confirm_password' => 'required|string|same:password',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign role to the seller
        $roleName = $request->input('role', 'seller'); // Default to 'seller' if no role is provided
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->assignRole($role->name);

        // remove previous user id from session
        $request->session()->forget('user_id');

        // store the user id in session
        $request->session()->put('user_id', $user->id);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'singup success',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user),
            ],
        ]);
    }

    public function createStore(Request $request)
    {
        $request->validate(
            [
                'name' => 'required|string',
                'domain' => 'required|string|unique:stores,domain',
            ],
            [
                'domain.required' => 'Url is required',
            ],
        );

        $user_id = $request->session()->get('user_id');

        $store = Store::create([
            'owner_id' => $user_id,
            'name' => $request->name,
            'slug' => $request->slug,
            'domain' => $request->domain,
        ]);

        // store user_id and store_id in store_session table
        StoreSession::create([
            'user_id' => $user_id,
            'store_id' => $store->id,
        ]);

        // remove previous store id from session
        $request->session()->forget('store_id');

        // store the store id in session
        $request->session()->put('store_id', $store->id);

        return response()->json([
            'status' => 200,
            'message' => 'store created successfully',
            'data' => new StoreResource($store),
        ]);
    }

    public function storeBranding(Request $request)
    {
        $request->validate([
            'logo' => 'nullable|string|max:255',
            'primary_color' => 'nullable|string',
            'secondary_color' => 'nullable|string',
        ]);

        $store_id = $request->session()->get('store_id');

        $store = Store::find($store_id);

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store id'
            ], 404);
        }

        $store->update([
            'logo' => $request->logo ?? 'https://placehold.co/600x400',
            'primary_color' => $request->primary_color,
            'secondary_color' => $request->secondary_color,
        ]);

        return response()->json(
            [
                'status' => 200,
                'message' => 'store branding updated successfully',
                'data' => new StoreResource($store),
            ],
            200,
        );
    }

    public function themeSelection(Request $request)
    {
        $request->validate([
            'theme_id' => 'nullable|exists:themes,id',
        ]);

        $store_id = $request->session()->get('store_id');

        $store = Store::find($store_id);

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store id'
            ], 404);
        }

        $store->update([
            'theme_id' => $request->theme_id,
        ]);

        // Send welcome email after theme selection
        $store->sendWelcomeEmail();

        return response()->json([
            'status' => 200,
            'message' => 'store theme selected successfully',
            'data' => new StoreResource($store),
            'theme' => $store->theme,
        ]);
    }
}
