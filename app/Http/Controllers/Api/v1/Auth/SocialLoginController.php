<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Store;
use App\Models\StoreSession;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Http\Resources\UserResource;
use App\Http\Resources\StoreResource;

class SocialLoginController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        $storeId = $request->query('store_id');
        session(['store_id' => $storeId]); // Store store_id in session
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    public function redirectToFacebook(Request $request)
    {
        $storeId = $request->query('store_id');
        session(['store_id' => $storeId]); // Store store_id in session
        return Socialite::driver('facebook')
            ->stateless()
            ->redirect();
    }

    public function UserHandleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            return $this->handleSocialLogin($googleUser, $request);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to login with Google'], 500);
        }
    }

    public function UserHandleFacebookCallback(Request $request)
    {
        try {
            $facebookUser = Socialite::driver('facebook')->stateless()->user();
            return $this->handleSocialLogin($facebookUser, $request);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to login with Facebook'], 500);
        }
    }

    private function handleSocialLogin($socialUser, Request $request)
    {
        $store = Store::find(session('store_id'));

        if (!$store) {
            return response()->json(['status' => 404, 'message' => 'Invalid store ID']);
        }

        $user = User::where('email', $socialUser->getEmail())->first();

        if ($user) {
            // If user exists but store_id is not associated, append it
            if (!in_array($store->id, (array) $user->store_id)) {
                $user->store_id = array_merge((array) $user->store_id, [$store->id]);
                $user->save();
            }
        } else {
            // Create new user
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(Str::random(24)),
                'store_id' => [$store->id],
            ]);

            // Assign role (default to 'user')
            $role = Role::firstOrCreate(['name' => $request->input('role', 'user')]);
            $user->assignRole($role->name);
        }

        // Generate API token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Store store_id in session
        session(['site_store_id' => $store->id]);
        if (session()->has('site_store_id')) {
            session()->forget('site_store_id');
        }

        session(['store_id' => $store->id]);
        session(['site_store_id' => $store->id]);
        $request->attributes->set('site_store_id', $store->id);

        return response()->json([
            'status' => 200,
            'message' => 'Login successful',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'store' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'domain' => $store->domain,
                ]
            ],
        ]);
    }


    // public function sellerHandleGoogleCallback(Request $request)
    // {
    //     try {
    //         $googleUser = Socialite::driver('google')->stateless()->user();

    //         // Check if the user already exists
    //         $user = User::where('email', $googleUser->getEmail())->first();

    //         if ($user) {
    //             // update or create store_id in the Store Session table
    //             $storeSession = $user->storeSession()->first();
    //             $store = null;

    //             if ($storeSession) {
    //                 // remove previous store id from session
    //                 $request->session()->forget('store_id');
    //                 if (session()->has('store_id')) {
    //                     session()->forget('store_id');
    //                 }

    //                 // store the store id in session
    //                 session(['store_id' => $storeSession->id]);

    //                 // Also set it in the request attributes
    //                 $request->attributes->set('store_id', $storeSession->store_id);

    //                 // find the store
    //                 $store = Store::find($storeSession->store_id);
    //             }

    //             if (!$storeSession) {
    //                 $store = Store::where('owner_id', $user->id)->first();

    //                 if ($store) {
    //                     StoreSession::updateOrCreate(
    //                         [
    //                             'user_id' => $user->id,
    //                         ],
    //                         [
    //                             'store_id' => $store->id,
    //                         ],
    //                     );

    //                     $request->session()->forget('store_id');
    //                     if (session()->has('store_id')) {
    //                         session()->forget('store_id');
    //                     }

    //                     // store the store id in session
    //                     session(['store_id' => $store->id]);

    //                     // Also set it in the request attributes
    //                     $request->attributes->set('store_id', $store->id);
    //                 }
    //             }
    //         }

    //         if (!$user) {
    //             // Create a new user
    //             $user = User::create([
    //                 'name' => $googleUser->getName(),
    //                 'email' => $googleUser->getEmail(),
    //                 'password' => Hash::make(Str::random(24)), // Random password
    //             ]);

    //             // Assign role to the seller
    //             $roleName = $request->input('role', 'seller'); // Default to 'seller' if no role is provided
    //             $role = Role::firstOrCreate(['name' => $roleName]);
    //             $user->assignRole($role->name);
    //         }

    //         // Generate an API token for the user
    //         // $token = $user->createToken('API Token')->plainTextToken;
    //         $token = $user->createToken('auth_token')->plainTextToken;

    //         $response = [
    //             'status' => 200,
    //             'message' => 'login success',
    //             'data' => [
    //                 'token_type' => 'Bearer',
    //                 'access_token' => $token,
    //                 'user' => new UserResource($user),
    //                 'membership' => null,
    //             ],
    //         ];

    //         if ($store) {
    //             $response['data']['logged_store'] = new StoreResource($store);
    //         }

    //         // return all stores
    //         $stores = Store::where(['owner_id' => $user->id])->get();
    //         if ($stores) {
    //             $response['data']['stores'] = StoreResource::collection($stores);
    //         }

    //         // Return the token and user details
    //         return response()->json($response, 200);
    //     } catch (\Exception $e) {
    //         return response()->json(['message' => 'Unable to login with Google'], 500);
    //     }
    // }

}

