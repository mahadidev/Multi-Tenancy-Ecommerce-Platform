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
        return apiResponse(function () use ($request) {
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
        });
    }

    public function updateProfile(Request $request)
    {
        return apiResponse(function () use ($request) {
            $user = auth()->user(); // Changed from store to stores

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'phone' => [
                    'nullable',
                    'string',
                    'regex:/^([+]{1}[8]{2}|0088)?(01){1}[3-9]{1}\d{8}$/', // BD format
                ],
                'address' => 'nullable|string|max:255',
                'image' => 'nullable|string|max:255',
                // 'password' => 'nullable|string|min:8|confirmed',
            ]);

            // $imagePath = null;
            // if ($request->hasFile('image') && isset($request->image)) {
            //     if($user->image) {
            //         Storage::disk('public')->delete($user->image);
            //     }
            //     $imagePath = $request->file('image')->store('users', 'public');
            // }

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
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
        });
    }

    public function passwordChange(Request $request)
    {
        return apiResponse(function () use ($request) {
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

            // generate new token
            // $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'message' => 'Password Updated and Logged Out',
                // 'data' => [
                //     // 'token_type' => 'Bearer',
                //     // 'access_token' => $token,
                //     'user' => new UserResource($user),
                // ],
            ], 200);
        });
    }
}
