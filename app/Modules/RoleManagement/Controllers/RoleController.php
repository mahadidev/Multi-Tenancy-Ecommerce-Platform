<?php

namespace App\Modules\RoleManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\RoleManagement\Models\Role;
use App\Modules\RoleManagement\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class RoleController extends Controller
{
    /**
     * Get all roles for the current store
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $storeId = authStore();
            
            $roles = Role::with('permissions')
                ->where(function($query) use ($storeId) {
                    $query->forStore($storeId)
                          ->orWhereNull('store_id'); // Include global roles
                })
                ->active()
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'roles' => $roles
                ],
                'message' => 'Roles retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve roles.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new role for the current store
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'permission_ids' => 'array',
                'permission_ids.*' => 'exists:permissions,id',
            ]);

            $storeId = authStore();
            $slug = Str::slug($request->name) . '-' . $storeId;

            // Check if role with this slug already exists for this store
            if (Role::where('slug', $slug)->where('store_id', $storeId)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'A role with this name already exists for this store.'
                ], 422);
            }

            $role = Role::create([
                'name' => $request->name,
                'slug' => $slug,
                'description' => $request->description,
                'store_id' => $storeId,
                'is_default' => false,
                'is_active' => true,
            ]);

            // Attach permissions if provided
            if ($request->has('permission_ids')) {
                $role->syncPermissions($request->permission_ids);
            }

            $role->load('permissions');

            return response()->json([
                'success' => true,
                'status' => 200,
                'data' => [
                    'role' => $role
                ],
                'message' => 'Role created successfully.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create role.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific role with its permissions
     */
    public function show(Role $role): JsonResponse
    {
        try {
            $storeId = authStore();
            
            // Check if user has access to this role
            if ($role->store_id && $role->store_id !== $storeId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied to this role.'
                ], 403);
            }

            $role->load('permissions');

            return response()->json([
                'success' => true,
                'role' => $role,
                'message' => 'Role retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve role.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a role
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        try {
            $storeId = authStore();
            
            // Check if user has access to this role
            if ($role->store_id && $role->store_id !== $storeId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied to this role.'
                ], 403);
            }

            // Prevent updating global roles
            if (!$role->store_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot edit global roles.'
                ], 403);
            }

            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'permission_ids' => 'array',
                'permission_ids.*' => 'exists:permissions,id',
                'is_active' => 'boolean',
            ]);

            // Update slug if name changed
            if ($request->name !== $role->name) {
                $slug = Str::slug($request->name) . '-' . $storeId;
                
                // Check if new slug already exists
                if (Role::where('slug', $slug)->where('id', '!=', $role->id)->where('store_id', $storeId)->exists()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'A role with this name already exists for this store.'
                    ], 422);
                }
                
                $role->slug = $slug;
            }

            $role->update($request->only(['name', 'description', 'is_active']));

            // Update permissions if provided
            if ($request->has('permission_ids')) {
                $role->syncPermissions($request->permission_ids);
            }

            $role->load('permissions');

            return response()->json([
                'success' => true,
                'status' => 200,
                'data' => [
                    'role' => $role
                ],
                'message' => 'Role updated successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update role.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a role
     */
    public function destroy(Role $role): JsonResponse
    {
        try {
            $storeId = authStore();
            
            // Check if user has access to this role
            if ($role->store_id && $role->store_id !== $storeId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied to this role.'
                ], 403);
            }

            // Prevent deleting global roles
            if (!$role->store_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete global roles.'
                ], 403);
            }

            // Prevent deleting default roles
            if ($role->is_default) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete default roles.'
                ], 403);
            }

            // Check if role is assigned to users
            if ($role->users()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete role that is assigned to users.'
                ], 422);
            }

            $role->delete();

            return response()->json([
                'success' => true,
                'status' => 200,
                'message' => 'Role deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete role.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clone a role template for the current store
     */
    public function cloneTemplate(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'template_slug' => 'required|string|exists:roles,slug',
                'name' => 'nullable|string|max:255',
            ]);

            $storeId = authStore();
            $template = Role::where('slug', $request->template_slug)->first();

            if (!$template) {
                return response()->json([
                    'success' => false,
                    'message' => 'Template role not found.'
                ], 404);
            }

            // Create role name
            $roleName = $request->name ?: str_replace('Template: ', '', $template->name);
            $slug = Str::slug($roleName) . '-' . $storeId;

            // Check if role already exists
            if (Role::where('slug', $slug)->where('store_id', $storeId)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'A role with this name already exists for this store.'
                ], 422);
            }

            // Clone the template
            $role = Role::create([
                'name' => $roleName,
                'slug' => $slug,
                'description' => $template->description,
                'store_id' => $storeId,
                'is_default' => false,
                'is_active' => true,
            ]);

            // Copy permissions
            $permissionIds = $template->permissions()->pluck('permissions.id')->toArray();
            $role->syncPermissions($permissionIds);

            $role->load('permissions');

            return response()->json([
                'success' => true,
                'role' => $role,
                'message' => 'Role created from template successfully.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clone role template.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign permissions to a role
     */
    public function assignPermissions(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'role_id' => 'required|exists:roles,id',
                'permission_ids' => 'required|array',
                'permission_ids.*' => 'exists:permissions,id',
            ]);

            $storeId = authStore();
            
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

            // Sync permissions
            $role->syncPermissions($request->permission_ids);
            $role->load('permissions');

            return response()->json([
                'success' => true,
                'status' => 200,
                'data' => [
                    'role' => $role
                ],
                'message' => 'Permissions assigned successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign permissions.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Revoke all permissions from a role
     */
    public function revokeAllPermissions(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'role_id' => 'required|exists:roles,id',
            ]);

            $storeId = authStore();
            
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

            // Remove all permissions
            $role->syncPermissions([]);
            $role->load('permissions');

            return response()->json([
                'success' => true,
                'status' => 200,
                'data' => [
                    'role' => $role
                ],
                'message' => 'All permissions revoked successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to revoke permissions.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}