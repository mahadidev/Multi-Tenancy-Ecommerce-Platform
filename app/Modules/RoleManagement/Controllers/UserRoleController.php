<?php

namespace App\Modules\RoleManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\RoleManagement\Models\Role;
use App\Modules\RoleManagement\Models\UserRole;
use App\Modules\UserManagement\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserRoleController extends Controller
{
    /**
     * Get all users with their roles for the current store
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $users = User::with(['userRoles' => function($query) use ($storeId) {
                $query->where('store_id', $storeId)->with('role');
            }])
            ->whereHas('userRoles', function($query) use ($storeId) {
                $query->where('store_id', $storeId);
            })
            ->get();

            return response()->json([
                'success' => true,
                'users' => $users,
                'message' => 'Users with roles retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve users with roles.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign a role to a user
     */
    public function assignRole(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'role_id' => 'required|exists:roles,id',
            ]);

            $storeId = authStore();
            $assignedBy = auth()->id();

            // Check if role belongs to current store or is global
            $role = Role::where('id', $request->role_id)
                ->where(function($query) use ($storeId) {
                    $query->where('store_id', $storeId)
                          ->orWhereNull('store_id');
                })
                ->first();

            if (!$role) {
                return response()->json([
                    'success' => false,
                    'message' => 'Role not found or access denied.'
                ], 404);
            }

            // Check if user already has this role for this store
            $existingAssignment = UserRole::where('user_id', $request->user_id)
                ->where('role_id', $request->role_id)
                ->where('store_id', $storeId)
                ->first();

            if ($existingAssignment) {
                return response()->json([
                    'success' => false,
                    'message' => 'User already has this role for this store.'
                ], 422);
            }

            // Create role assignment
            $userRole = UserRole::create([
                'user_id' => $request->user_id,
                'role_id' => $request->role_id,
                'store_id' => $storeId,
                'assigned_by' => $assignedBy,
                'assigned_at' => now(),
            ]);

            $userRole->load(['user', 'role', 'assignedBy']);

            return response()->json([
                'success' => true,
                'user_role' => $userRole,
                'message' => 'Role assigned to user successfully.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign role to user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a role from a user
     */
    public function revokeRole(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'role_id' => 'required|exists:roles,id',
            ]);

            $storeId = authStore();

            $userRole = UserRole::where('user_id', $request->user_id)
                ->where('role_id', $request->role_id)
                ->where('store_id', $storeId)
                ->first();

            if (!$userRole) {
                return response()->json([
                    'success' => false,
                    'message' => 'Role assignment not found.'
                ], 404);
            }

            $userRole->delete();

            return response()->json([
                'success' => true,
                'message' => 'Role revoked from user successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to revoke role from user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's roles for the current store
     */
    public function userRoles(Request $request, User $user): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $userRoles = UserRole::with('role.permissions')
                ->where('user_id', $user->id)
                ->where('store_id', $storeId)
                ->get();

            return response()->json([
                'success' => true,
                'user_roles' => $userRoles,
                'message' => 'User roles retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user roles.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update multiple role assignments for a user
     */
    public function updateUserRoles(Request $request, User $user): JsonResponse
    {
        try {
            $request->validate([
                'role_ids' => 'required|array',
                'role_ids.*' => 'exists:roles,id',
            ]);

            $storeId = authStore();
            $assignedBy = auth()->id();

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

            // Remove existing role assignments for this user and store
            UserRole::where('user_id', $user->id)
                ->where('store_id', $storeId)
                ->delete();

            // Create new role assignments
            $userRoles = [];
            foreach ($request->role_ids as $roleId) {
                $userRoles[] = UserRole::create([
                    'user_id' => $user->id,
                    'role_id' => $roleId,
                    'store_id' => $storeId,
                    'assigned_by' => $assignedBy,
                    'assigned_at' => now(),
                ]);
            }

            // Load relationships
            $userRoles = UserRole::with(['role.permissions'])
                ->where('user_id', $user->id)
                ->where('store_id', $storeId)
                ->get();

            return response()->json([
                'success' => true,
                'user_roles' => $userRoles,
                'message' => 'User roles updated successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user roles.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}