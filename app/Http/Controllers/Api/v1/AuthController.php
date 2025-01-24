<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StoreResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Store;
use App\Models\StoreSession;
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
            'password' => 'required',
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        // Check if the user exists and the password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(
                [
                    'message' => 'Invalid email or password.',
                ],
                401,
            );
        }

        // Check if the user has the role of 'seller'
        if (!$user->hasRole('seller')) {
            return response()->json(
                [
                    'message' => 'Unauthorized. Only sellers can log in.',
                ],
                403,
            );
        }

        // update or create store_id in the Store Session table
        $storeSession = $user->storeSession()->first();
        $store = null;

        if ($storeSession) {
            // remove previous store id from session
            $request->session()->forget('store_id');
            if(session()->has('store_id')){
                session()->forget('store_id');
            }

            // store the store id in session
            session(['store_id' => $storeSession->id]);

            // Also set it in the request attributes
            $request->attributes->set('store_id', $storeSession->store_id);

            // find the store
            $store = Store::find($storeSession->store_id);
        }

        if (!$storeSession) {
            $store = Store::where('owner_id', $user->id)->first();

            if($store){
                StoreSession::updateOrCreate([
                    'user_id' => $user->id,
                ], [
                    'store_id' => $store->id,
                ]);

                $request->session()->forget('store_id');
                if(session()->has('store_id')){
                    session()->forget('store_id');
                }

                // store the store id in session
                session(['store_id' => $store->id]);

                // Also set it in the request attributes
                $request->attributes->set('store_id', $store->id);

            }

        }

        // Generate a Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = [
            'status' => 200,
            'message' => 'login success',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user),
                'membership' => null,
            ],
        ];

        if ($store) {
            $response['data']['logged_store'] = new StoreResource($store);
        }

        // return all stores
        $stores = Store::where(["owner_id" => $user->id])->get();
        if($stores){
            $response['data']['stores'] = StoreResource::collection($stores);
        }

        // Return the token and user details
        return response()->json($response);
    }

    public function sellerRegister(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required',
            'confirm_password' => 'required|same:password',
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'message' => 'singup success',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => new UserResource($user),
            ],
        ], 200);
    }

    // User or Customer authentication functions

    public function userLogin(Request $request)
    {
        $request->validate([
            'email' => 'string|required',
            'password' => 'required',
        ]);

        if (!$request->has('store_id')) {
            return response()->json([
                'status' => 404,
                'message' => 'Store ID is not found',
            ]);
        }

        $store = Store::find($request->input('store_id'));

        if (!$store) {
            return response()->json([
                'status' => 404,
                'message' => 'Invalid store id',
            ]);
        }

        // Find the user by email and add the store in the user table
        $user = User::where('email', $request->email)->first();

        // Check if user exists, password matches, and the user has the 'user' role
        if (!$user || !Hash::check($request->password, $user->password) || !$user->hasRole('user')) {
            $message = !$user || !Hash::check($request->password, $user->password) ? 'Invalid email or password' : 'Unauthorized. Only customers can log in.';

            $statusCode = !$user || !Hash::check($request->password, $user->password) ? 401 : 403;

            return response()->json(
                [
                    'status' => $statusCode,
                    'message' => $message,
                ],
            );
        }

        // Check if 'store_id' is null or if the store ID doesn't exist in the array for users table
        $storeId = $store->id;
        if (is_null($user->store_id) || !in_array($storeId, $user->store_id)) {
            return response()->json([
                'status' => 404,
                'message' => 'This store is not associated with the user, please sign-up'
            ]);
        }

        // Generate a Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        //add store_id in the session
        session(['site_store_id' => $store->id]); // Store the new `store_id` in the session
        $request->attributes->set('site_store_id', $store->id); // Also set it in the request attributes

        // Return the token and user details
        return response()->json([
            'status' => 200,
            'message' => 'login success',
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
                ],
            ],
        ]);
    }

    public function userRegister(Request $request)
    {
        return apiResponse(function () use ($request) {
            $this->validateRegistrationRequest($request);

            $storeId = (int) $request->store_id;
            $email = $request->email;

            // Check for existing user with same email and store
            if ($this->userExistsInStore($email, $storeId)) {
                return $this->errorResponse('Email already registered for this store', 400);
            }

            // Try to find user with same email in different store
            $existingUser = $this->findUserInDifferentStore($email, $storeId);

            if ($existingUser) {
                return $this->handleExistingUserRegistration($existingUser, $storeId, $request);
            }

            // Create new user
            $user = $this->createNewUser($request, $storeId);

            return $this->generateSuccessResponse($user, $request, $storeId);
        });
    }

    private function validateRegistrationRequest(Request $request)
    {
        return $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email',
            'password' => 'required|string',
            'confirm_password' => 'required|string|same:password',
            'store_id' => 'required|exists:stores,id,deleted_at,NULL', // Check for non-deleted stores
        ]);
    }

    private function userExistsInStore(string $email, int $storeId): bool
    {
        return User::where('email', $email)->whereJsonContains('store_id', $storeId)->exists();
    }

    private function findUserInDifferentStore(string $email, int $storeId)
    {
        return User::where('email', $email)
            // ->whereHas('roles', function ($query) {
            //     $query->where('name', 'user'); // Check if the user has the role of 'user'
            // })
            ->whereJsonDoesntContain('store_id', $storeId)
            ->first();
    }

    private function createNewUser(Request $request, int $storeId): User
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'store_id' => [$storeId],
        ]);

        $roleName = $request->input('role', 'user');
        $role = Role::firstOrCreate(['name' => $roleName]);
        $user->assignRole($role->name);

        return $user;
    }

    private function handleExistingUserRegistration(User $user, int $storeId, Request $request)
    {
        $storeIds = $user->store_id ?? [];
        $storeIds[] = $storeId;

        // check if the user has the role of 'user'
        if (!$user->hasRole('user')) {
            $roleName = $request->input('role', 'user');
            $role = Role::firstOrCreate(['name' => $roleName]);
            $user->assignRole($role->name);
        }
        $user->update(['store_id' => $storeIds]);

        return $this->generateSuccessResponse($user, $request, $storeId);
    }

    private function generateSuccessResponse(User $user, Request $request, int $storeId)
    {
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->storeSessionData($request, $storeId);

        return response()->json([
            'status' => 200,
            'message' => 'Signup successful',
            'data' => [
                'token_type' => 'Bearer',
                'access_token' => $token,
                'user' => $user,
            ],
        ], 200);
    }

    private function storeSessionData(Request $request, int $storeId): void
    {
        if (session()->has('site_store_id')) {
            session()->forget('site_store_id');
        }

        session(['site_store_id' => $storeId]);
        $request->attributes->set('site_store_id', $storeId);
    }

    private function errorResponse(string $message, int $status)
    {
        return response()->json(
            [
                'status' => $status,
                'message' => $message,
                'data' => null,
            ],
            $status,
        );
    }

    public function logout(Request $request)
    {
        return apiResponse(function () use ($request) {
            $user = auth()->user();
            if ($user) {
                $user->tokens()->delete();
                session()->flush();
                return response()->json([
                    'status' => 200,
                    'message' => 'Logout successful',
                ]);
            }
            return $this->errorResponse('User is not authenticated', 400);
        });
    }
}
