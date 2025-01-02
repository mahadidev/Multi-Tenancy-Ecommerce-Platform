<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

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
}
