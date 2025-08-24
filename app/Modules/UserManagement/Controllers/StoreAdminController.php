<?php

namespace App\Modules\UserManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\UserManagement\Models\User;
use App\Modules\RoleManagement\Models\Role;
use App\Modules\StoreManagement\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Modules\UserManagement\Resources\UserResource;

class StoreAdminController extends Controller
{
    /**
     * Get all admins for the current store
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $storeId = authStore();
            
            // Get all users who have roles in this store
            $admins = User::whereHas('userRoles', function($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->with(['userRoles' => function($query) use ($storeId) {
                $query->where('store_id', $storeId)->with('role');
            }, 'storeSession'])
            ->get();

            // Transform the data to match frontend expectations
            $storeAdmins = $admins->map(function($admin) {
                $roles = $admin->userRoles->pluck('role.name')->filter()->values();
                
                return [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $roles->toArray(),
                    'phone' => $admin->phone,
                    'address' => $admin->address,
                    'image' => $admin->user_image,
                    'store_session' => $admin->storeSession ? [
                        'store_id' => $admin->storeSession->store_id,
                        'store_name' => optional($admin->storeSession->store)->name,
                        'store_domain' => optional($admin->storeSession->store)->domain,
                    ] : null
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'store_admins' => $storeAdmins
                ],
                'message' => 'Store admins retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve store admins.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new store admin
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'role_ids' => 'required|array',
                'role_ids.*' => 'exists:roles,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors()
                ], 422);
            }

            $storeId = authStore();
            
            \Log::info('Role IDs received:', ['role_ids' => $request->role_ids, 'store_id' => $storeId]);
            
            // Validate that all roles belong to current store or are global
            $validRoles = Role::whereIn('id', $request->role_ids)
                ->where(function($query) use ($storeId) {
                    $query->where('store_id', $storeId)
                          ->orWhereNull('store_id');
                })
                ->pluck('id')
                ->toArray();

            if (count($validRoles) !== count($request->role_ids)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Some roles not found or access denied.'
                ], 422);
            }

            // Create the user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'address' => $request->address,
                'email_verified_at' => now(), // Auto-verify admin users
            ]);

            // Assign roles to the user for this store
            $assignedBy = auth()->id();
            foreach ($request->role_ids as $roleId) {
                $result = $user->assignCustomRoleById($roleId, $storeId, $assignedBy);
                if (!$result) {
                    \Log::warning("Failed to assign role {$roleId} to user {$user->id} for store {$storeId}");
                }
            }

            // Create store session for the user
            $user->storeSession()->updateOrCreate(
                ['user_id' => $user->id],
                ['store_id' => $storeId]
            );

            // Load relationships and return
            $user->load(['userRoles' => function($query) use ($storeId) {
                $query->where('store_id', $storeId)->with('role');
            }, 'storeSession']);

            $roles = $user->userRoles->pluck('role.name')->filter()->values();
            
            $adminData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roles->toArray(),
                'phone' => $user->phone,
                'address' => $user->address,
                'image' => $user->user_image,
                'store_session' => $user->storeSession ? [
                    'store_id' => $user->storeSession->store_id,
                    'store_name' => optional($user->storeSession->store)->name,
                    'store_domain' => optional($user->storeSession->store)->domain,
                ] : null
            ];

            return response()->json([
                'success' => true,
                'status' => 200,
                'data' => [
                    'admin' => $adminData
                ],
                'message' => 'Store admin created successfully.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create store admin.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific store admin
     */
    public function show(User $admin): JsonResponse
    {
        try {
            $storeId = authStore();
            
            // Check if admin has access to this store
            if (!$admin->userRoles()->where('store_id', $storeId)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin not found for this store.'
                ], 404);
            }

            $admin->load(['userRoles' => function($query) use ($storeId) {
                $query->where('store_id', $storeId)->with('role');
            }, 'storeSession']);

            $roles = $admin->userRoles->pluck('role.name')->filter()->values();
            
            $adminData = [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $roles->toArray(),
                'phone' => $admin->phone,
                'address' => $admin->address,
                'image' => $admin->user_image,
                'store_session' => $admin->storeSession ? [
                    'store_id' => $admin->storeSession->store_id,
                    'store_name' => optional($admin->storeSession->store)->name,
                    'store_domain' => optional($admin->storeSession->store)->domain,
                ] : null
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'admin' => $adminData
                ],
                'message' => 'Store admin retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve store admin.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a store admin
     */
    public function update(Request $request, User $admin): JsonResponse
    {
        try {
            $storeId = authStore();
            
            // Check if admin has access to this store
            if (!$admin->userRoles()->where('store_id', $storeId)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin not found for this store.'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $admin->id,
                'password' => 'nullable|string|min:8|confirmed',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'role_ids' => 'required|array',
                'role_ids.*' => 'exists:roles,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed.',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Validate that all roles belong to current store or are global
            $validRoles = Role::whereIn('id', $request->role_ids)
                ->where(function($query) use ($storeId) {
                    $query->where('store_id', $storeId)
                          ->orWhereNull('store_id');
                })
                ->pluck('id')
                ->toArray();

            if (count($validRoles) !== count($request->role_ids)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Some roles not found or access denied.'
                ], 422);
            }

            // Update user data
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
            ];

            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $admin->update($updateData);

            // Update roles for this store
            $admin->userRoles()->where('store_id', $storeId)->delete();
            
            $assignedBy = auth()->id();
            foreach ($request->role_ids as $roleId) {
                $admin->assignCustomRoleById($roleId, $storeId, $assignedBy);
            }

            // Load relationships and return
            $admin->load(['userRoles' => function($query) use ($storeId) {
                $query->where('store_id', $storeId)->with('role');
            }, 'storeSession']);

            $roles = $admin->userRoles->pluck('role.name')->filter()->values();
            
            $adminData = [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $roles->toArray(),
                'phone' => $admin->phone,
                'address' => $admin->address,
                'image' => $admin->user_image,
                'store_session' => $admin->storeSession ? [
                    'store_id' => $admin->storeSession->store_id,
                    'store_name' => optional($admin->storeSession->store)->name,
                    'store_domain' => optional($admin->storeSession->store)->domain,
                ] : null
            ];

            return response()->json([
                'success' => true,
                'status' => 200,
                'data' => [
                    'admin' => $adminData
                ],
                'message' => 'Store admin updated successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update store admin.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a store admin
     */
    public function destroy(User $admin): JsonResponse
    {
        try {
            $storeId = authStore();
            
            // Check if admin has access to this store
            if (!$admin->userRoles()->where('store_id', $storeId)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin not found for this store.'
                ], 404);
            }

            // Prevent deleting the store owner
            $store = Store::find($storeId);
            if ($store && $store->owner_id === $admin->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete the store owner.'
                ], 422);
            }

            // Remove role assignments for this store only
            $admin->userRoles()->where('store_id', $storeId)->delete();

            // If admin has no more role assignments, delete the store session
            if (!$admin->userRoles()->exists()) {
                $admin->storeSession()->delete();
            }

            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Store admin removed successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove store admin.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}