<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function profile(Request $request)
    {
        $user = auth()->user(); // Changed from store to stores

        if ($user) {
            return response()->json([
                'status' => 200,
                'message' => 'Profile Information',
                'data' => [
                    'user' => new UserResource($user),
                ]
            ], 200);
        }

        return response()->json([
            'status' => 401,
            'message' => 'User is not authenticated',
        ], 401);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user(); // Changed from store to stores

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id, 
            'phone' => [
                'nullable',
                'string',
                'regex:/^([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8}$/', // BD format
            ],
            'address' => 'nullable|string|max:255',
            'image' => 'nullable|string|max:255',
            // 'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'image' => $validated['image'] ?? $user->image,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Profile Updated',
            'data' => [
                'token_type' => 'Bearer',
                'user' => new UserResource($user),
            ],
        ], 200);
    }

    public function passwordChange(Request $request)
    {
        $user = auth()->user(); // Changed from store to stores

        $validated = $request->validate([
            'old_password' => 'required|string',
            'password' => 'required|string',
            'confirm_password' => 'required|string|same:password',
        ]);

        if (!Hash::check($validated['old_password'], $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'Old password is incorrect',
            ], 401);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Revoke all tokens
        $user->tokens()->delete();
        session()->flush();

        return response()->json([
            'status' => 200,
            'message' => 'Password Updated and Logged Out',
        ], 200);
    }
}
