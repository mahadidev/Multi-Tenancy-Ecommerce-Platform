<?php

namespace App\Modules\RoleManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\RoleManagement\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    /**
     * Get all permissions grouped by category
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $permissions = Permission::active()
                ->orderBy('group')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'permissions' => $permissions
                ],
                'message' => 'Permissions retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve permissions.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get permissions for a specific group
     */
    public function byGroup(Request $request, string $group): JsonResponse
    {
        try {
            $permissions = Permission::active()
                ->byGroup($group)
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'permissions' => $permissions
                ],
                'message' => 'Permissions retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve permissions.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all permissions grouped by category
     */
    public function grouped(Request $request): JsonResponse
    {
        try {
            $permissions = Permission::active()
                ->orderBy('group')
                ->orderBy('name')
                ->get()
                ->groupBy('group');

            return response()->json([
                'success' => true,
                'data' => [
                    'permissions' => $permissions
                ],
                'message' => 'Grouped permissions retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve grouped permissions.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new permission
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:permissions,slug',
                'description' => 'nullable|string',
                'group' => 'required|string|max:255',
            ]);

            $permission = Permission::create($request->all());

            return response()->json([
                'success' => true,
                'permission' => $permission,
                'message' => 'Permission created successfully.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create permission.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific permission
     */
    public function show(Permission $permission): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'permission' => $permission,
                'message' => 'Permission retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve permission.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a permission
     */
    public function update(Request $request, Permission $permission): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:permissions,slug,' . $permission->id,
                'description' => 'nullable|string',
                'group' => 'required|string|max:255',
                'is_active' => 'boolean',
            ]);

            $permission->update($request->all());

            return response()->json([
                'success' => true,
                'permission' => $permission,
                'message' => 'Permission updated successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update permission.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a permission
     */
    public function destroy(Permission $permission): JsonResponse
    {
        try {
            // Check if permission is being used by any roles
            if ($permission->roles()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete permission that is assigned to roles.'
                ], 422);
            }

            $permission->delete();

            return response()->json([
                'success' => true,
                'message' => 'Permission deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete permission.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}