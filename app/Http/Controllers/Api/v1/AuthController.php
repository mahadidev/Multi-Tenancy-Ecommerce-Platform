<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Store;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use App\Helpers\ApiResponse;

class AuthController extends Controller
{
    public function sellerLogin(Request $request)
    {
        $request->validate([
            'email' => 'string|required',
            'password' => 'string|required',
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        // Check if the user exists and the password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        // Check if the user has the role of 'seller'
        if (!$user->hasRole('seller')) {
            return response()->json([
                'message' => 'Unauthorized. Only sellers can log in.',
            ], 403);
        }

        // Generate a Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the token and user details
        return response()->json([
            'status' => 200,
            'message' => 'login success',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user),
                'stores' => StoreResource::collection($user->stores),
                'membership' => null
            ]
        ]);
    }

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
            'password' =>  Hash::make($request->password)
        ]);

        // Assign role to the seller
        $roleName = $request->input('role', 'seller'); // Default to 'seller' if no role is provided
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->assignRole($role->name);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'singup success',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user)
            ]
        ]);
    }

    public function userLogin(Request $request)
    {

        $request->validate([
            'email' => 'string|required',
            'password' => 'string|required',
        ]);


        if (!$request->has('store_id')) {
            return response()->json([
                'status' => 404,
                'message' => 'Store ID not found',
            ]);
        }

        $store = Store::findorfail($request->input('store_id'));
        $storeId = $store->id;

        if (!$store) {
            return response()->json([
                'status' => 500,
                'message' => 'Invalid store id',
            ]);
        }

        // Find the user by email and add the store in the user table
        $user = User::where('email', $request->email)->first();

        // Check if 'store_id' is null or if the store ID doesn't exist in the array
        if (is_null($user->store_id) || !in_array($storeId, $user->store_id)) {
            $storeIds = $user->store_id ?? []; // Use an empty array if it's null
            $storeIds[] = $storeId; // Add the new store ID
            $user->update(['store_id' => $storeIds]); // Update the user
        }

        // Check if the user exists and the password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        // Check if the user has the role of 'user'
        if (!$user->hasRole('user')) {
            return response()->json([
                'message' => 'Unauthorized. Only customers can log in.',
            ], 403);
        }

        // Generate a Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        //add store_id in the session 
        session(['store_id' => $store->id]);  // Store the new `store_id` in the session
        $request->attributes->set('store_id', $store->id);  // Also set it in the request attributes

        // Return the token and user details
        return response()->json([
            'status' => 200,
            'message' => 'login success',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user),
                'logged_store' => new StoreResource(getStore())
            ]
        ]);
    }

    public function userRegister(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|string|email',
            'password' => 'required|string',
            'confirm_password' => 'required|string|same:password',
        ]);

        // check if the email is already registered for the same store
        $query = User::where('email', $request->email)
            ->whereIn('store_id', authStore())
            ->first();

        if ($query) {
            return response()->json([
                'status' => 400,
                'message' => 'Email already registered',
            ], 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' =>  Hash::make($request->password),
            'store_id' => authStore(),
        ]);

        // Assign role to the customer
        $roleName = $request->input('role', 'customer'); // Default to 'customer' if no role is provided
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->assignRole($role->name);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'singup success',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user)
            ]
        ]);
    }

    public function profile(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'status' => 400,
                'message' => 'User is not authenticated',
            ], 400);
        }
        return response()->json([
            'status' => 200,
            'message' => 'User profile',
            'data' => new UserResource($user)
        ]);
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            // Auth::user()->tokens()->delete();
            return response()->json([
                'status' => 200,
                'message' => 'Logout successful',
            ]);
        }
        return response()->json([
            'status' => 400,
            'message' => 'User is not authenticated',
        ], 400);


        // $user = Auth::id();
        // return response()->json([
        //     'status' => 200,
        //     'message' => 'Logout successful',
        //     'data' => $user
        // ]);
        // // Ensure the user is authenticated
        // if (Auth::user()) {
        //     // // Delete all personal access tokens for the user
        //     // $user->tokens()->delete();

        //     // // Log the user out of the application
        //     // Auth::logout();

        //     // // Invalidate the session
        //     // $request->session()->invalidate();

        //     // // Regenerate the session token to prevent CSRF attacks
        //     // $request->session()->regenerateToken();

        //     return response()->json([
        //         'status' => 200,
        //         'message' => 'Logout successful',
        //     ]);
        // }

        // return response()->json([
        //     'status' => 400,
        //     'message' => 'User is not authenticated',
        // ], 400);
    }
}
