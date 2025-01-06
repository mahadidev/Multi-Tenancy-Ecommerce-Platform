<?php

namespace App\Http\Controllers\Api\v1\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function profile(Request $request)
    {
        return apiResponse(function () use ($request) {
            $user = auth()->user()->load('roles'); // Changed from store to stores

            return response()->json([
                'status' => 200,
                'message' => 'Profile Information',
                'data' => [
                    'token_type' => 'Bearer',
                    'user' => new UserResource($user),
                ],
            ]);
        });
    }

    // public function profile2(Request $request)
    // {
    //     return apiResponse(function () use ($request) {
    //         $user = auth()->user()->load('roles'); // Changed from store to stores

    //         return response()->json([
    //             'status' => 200,
    //             'message' => 'Profile Information2',
    //             'data' => [
    //                 'token_type' => 'Bearer',
    //                 'user' => new UserResource($user),
    //             ],
    //         ]);
    //     });
    // }


    public function updateProfile(Request $request)
    {
        return apiResponse(function () use ($request) {
            $user = auth()->user(); // Changed from store to stores

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'phone' => 'nullable|string|max:255',
                'address' => 'nullable|string|max:255',
                'image' => 'nullable',
                // 'password' => 'nullable|string|min:8|confirmed',
            ]);

            $imagePath = null;
            if ($request->hasFile('image') && isset($request->image)) {
                if($user->image) {
                    Storage::disk('public')->delete($user->image);
                }
                $imagePath = $request->file('image')->store('users', 'public');
            }

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'image' => $imagePath ? $imagePath : $user->image,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Profile Updated',
                'data' => [
                    'token_type' => 'Bearer',
                    'user' => new UserResource($user),
                ],
            ]);
        });
    }
}
