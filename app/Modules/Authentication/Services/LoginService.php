<?php

namespace App\Modules\Authentication\Services;

use App\Http\Resources\StoreResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use App\Modules\StoreManagement\Models\Store;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class LoginService
{
    protected SessionService $sessionService;

    public function __construct(SessionService $sessionService)
    {
        $this->sessionService = $sessionService;
    }

    public function authenticateSeller(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'string|required',
            'password' => 'required',
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        // Check if the user exists and the password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        // Handle store session management
        $this->sessionService->handleStoreSession($user, $request);

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

        // Add store information to response
        $this->addStoreDataToResponse($response, $user);

        return response()->json($response, 200);
    }

    public function authenticateUser(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'string|required',
            'password' => 'required',
        ]);

        if (!$request->has('store_id')) {
            return $this->errorResponse('Store ID is not found', 404);
        }

        $store = Store::find($request->input('store_id'));

        if (!$store) {
            return $this->errorResponse('Invalid store id', 404);
        }

        $user = User::where('email', $request->email)
            ->where('email_verified_at', '!=', null)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password) || !$user->hasRole('user')) {
            $message = !$user || !Hash::check($request->password, $user->password)
                ? 'Invalid email or password'
                : 'Unauthorized. Only customers can log in.';

            $statusCode = !$user || !Hash::check($request->password, $user->password) ? 401 : 403;

            return $this->errorResponse($message, $statusCode);
        }

        $storeId = $store->id;
        if (is_null($user->store_id) || !in_array($storeId, $user->store_id)) {
            return $this->errorResponse('This store is not associated with the user, please sign-up', 404);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        session(['site_store_id' => $store->id]);
        $request->attributes->set('site_store_id', $store->id);

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
        ], 200);
    }

    public function logout(): JsonResponse
    {
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
    }

    private function addStoreDataToResponse(array &$response, User $user): void
    {
        $storeSession = $user->storeSession()->first();

        if ($storeSession) {
            $store = Store::find($storeSession->store_id);
            if ($store) {
                $response['data']['logged_store'] = new StoreResource($store);
            }
        }

        $stores = Store::where(['owner_id' => $user->id])->get();
        if ($stores->isNotEmpty()) {
            $response['data']['stores'] = StoreResource::collection($stores);
        }
    }

    private function errorResponse(string $message, int $status): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => null,
        ], $status);
    }
}