<?php

namespace App\Modules\UserManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\UserManagement\Services\UserService;
use App\Modules\UserManagement\Requests\CreateUserRequest;
use App\Modules\UserManagement\Requests\UpdateUserRequest;
use App\Modules\UserManagement\Requests\UpdateProfileRequest;
use App\Modules\UserManagement\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        $this->middleware('auth:sanctum');
    }

    /**
     * Get paginated users for current store
     */
    public function index(Request $request): JsonResponse
    {
        $storeId = $request->attributes->get('store_id') ?? session('store_id');
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store context not found',
            ], 400);
        }

        $users = $this->userService->getUsersForStore($storeId, $request);

        return response()->json([
            'status' => 200,
            'message' => 'Users retrieved successfully',
            'data' => [
                'users' => UserResource::collection($users->items()),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ],
            ],
        ]);
    }

    /**
     * Create a new user
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $storeId = $request->attributes->get('store_id') ?? session('store_id');
        
        $userData = $request->validated();
        $userData['store_id'] = [$storeId];

        $user = $this->userService->createUser($userData);

        return response()->json([
            'status' => 201,
            'message' => 'User created successfully',
            'data' => [
                'user' => new UserResource($user),
            ],
        ], 201);
    }

    /**
     * Get user details
     */
    public function show(User $user): JsonResponse
    {
        $profile = $this->userService->getUserProfile($user);

        return response()->json([
            'status' => 200,
            'message' => 'User details retrieved successfully',
            'data' => [
                'user' => $profile,
            ],
        ]);
    }

    /**
     * Update user
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $updatedUser = $this->userService->updateUser($user, $request->validated());

        return response()->json([
            'status' => 200,
            'message' => 'User updated successfully',
            'data' => [
                'user' => new UserResource($updatedUser),
            ],
        ]);
    }

    /**
     * Delete user
     */
    public function destroy(User $user): JsonResponse
    {
        $this->userService->deleteUser($user);

        return response()->json([
            'status' => 200,
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Get current user profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $this->userService->getUserProfile($user);

        return response()->json([
            'status' => 200,
            'message' => 'Profile retrieved successfully',
            'data' => [
                'profile' => $profile,
            ],
        ]);
    }

    /**
     * Update current user profile
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        
        try {
            $updatedUser = $this->userService->updateProfile($user, $request->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Profile updated successfully',
                'data' => [
                    'user' => new UserResource($updatedUser),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 400,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get user statistics
     */
    public function stats(Request $request): JsonResponse
    {
        $storeId = $request->attributes->get('store_id') ?? session('store_id');
        $stats = $this->userService->getUserStats($storeId);

        return response()->json([
            'status' => 200,
            'message' => 'User statistics retrieved successfully',
            'data' => [
                'stats' => $stats,
            ],
        ]);
    }

    /**
     * Add user to store
     */
    public function addToStore(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
            'role' => 'sometimes|string|exists:roles,name',
        ]);

        $storeId = $request->get('store_id');
        $role = $request->get('role', 'user');

        $this->userService->addUserToStore($user, $storeId, $role);

        return response()->json([
            'status' => 200,
            'message' => 'User added to store successfully',
        ]);
    }

    /**
     * Remove user from store
     */
    public function removeFromStore(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'store_id' => 'required|exists:stores,id',
        ]);

        $storeId = $request->get('store_id');
        $this->userService->removeUserFromStore($user, $storeId);

        return response()->json([
            'status' => 200,
            'message' => 'User removed from store successfully',
        ]);
    }
}