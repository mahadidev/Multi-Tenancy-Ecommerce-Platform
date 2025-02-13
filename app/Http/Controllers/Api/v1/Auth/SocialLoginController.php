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
        $loginType = $request->query('login_type', 'seller'); // Default to 'seller' if not specified
        $storeId = $request->query('store_id');

        $authUrl = Socialite::driver('google')
            ->stateless()
            ->with([
                'login_type' => $loginType,
                'store_id' => $storeId,
                'state' => base64_encode(json_encode([
                    'login_type' => $loginType,
                    'store_id' => $storeId
                ]))
            ])
            ->redirect()
            ->getTargetUrl(); // Gets the Google OAuth URL instead of redirecting

        return response()->json([
            'status' => 200,
            'data' => [
                'auth_url' => $authUrl
            ]
        ], 200);
    }


    public function redirectToFacebook(Request $request)
    {
        $loginType = $request->query('login_type', 'seller');
        $storeId = $request->query('store_id');

        $authUrl = Socialite::driver('facebook')
            ->stateless()
            ->with([
                'login_type' => $loginType,
                'store_id' => $storeId,
                'state' => base64_encode(json_encode([
                    'login_type' => $loginType,
                    'store_id' => $storeId
                ]))
            ])
            ->redirect()
            ->getTargetUrl(); // Gets the Google OAuth URL instead of redirecting

        return response()->json([
            'status' => 200,
            'data' => [
                'auth_url' => $authUrl
            ]
        ], 200);
    }

    public function UserHandleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $state = json_decode(base64_decode($request->input('state')), true);
            return $this->handleSocialLogin($googleUser, $request, $state);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to login with Google'], 500);
        }
    }

    public function UserHandleFacebookCallback(Request $request)
    {
        try {
            $facebookUser = Socialite::driver('facebook')->stateless()->user();
            $state = json_decode(base64_decode($request->input('state')), true);
            return $this->handleSocialLogin($facebookUser, $request, $state);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to login with Facebook'], 500);
        }
    }

    private function handleSocialLogin($socialUser, Request $request, array $state)
    {
        $loginType = $state['login_type'] ?? 'seller';
        $storeId = $state['store_id'] ?? null;

        if ($loginType === 'user' && $storeId) {
            return $this->userSocialLogin($socialUser, $request, $storeId);
        } else {
            return $this->sellerSocialLogin($socialUser, $request);
        }
    }

    private function userSocialLogin($socialUser, Request $request, $storeId)
    {
        $store = Store::find($storeId);

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
                'email_verified_at' => now(),
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

        return redirect()->to(url('/user/social-media?token=' . $token . '&user_id=' . $user->id . '&store_id=' . $store->id));
    }

    private function sellerSocialLogin($socialUser, Request $request)
    {
        $user = User::where('email', $socialUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(Str::random(24)),
                'email_verified_at' => now(),
            ]);
        }
        // Assign role to the seller
        $roleName = $request->input('role', 'seller'); // Default to 'seller' if no role is provided
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->assignRole($role->name);

        // Generate API token
        $token = $user->createToken('auth_token')->plainTextToken;

        return redirect()->to(url('/seller/social-media?token=' . $token . '&user_id=' . $user->id));
    }

    public function socialMediaLogin(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'user_id' => 'required|exists:users,id',
            'store_id' => 'nullable|exists:stores,id',
        ]);

        $token = $request->input('token');
        $user = User::find($request->input('user_id'));
        $store = $request->input('store_id') ? Store::find($request->input('store_id')) : null;

        return response()->json([
            'status' => 200,
            'message' => 'Login successful',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user),
                'store' => $store ? new StoreResource($store) : null,
            ],
        ], 200);
    }
}
