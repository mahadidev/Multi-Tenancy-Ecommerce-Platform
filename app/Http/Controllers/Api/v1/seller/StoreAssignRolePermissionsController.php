<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Resources\RoleResource;

class StoreAssignRolePermissionsController extends Controller
{
    public function assignPermissions(Request $request)
    {
        $request->validate([
            'role_id' => 'required|integer|exists:roles,id',
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'integer|exists:permissions,id',
        ]);

        $role = Role::where('store_id', authStore())->find($request->role_id);

        if (!$role) {
            return response()->json([
                'status' => 404,
                'message' => 'Role not found',
            ], 404);
        }

        $permissions = Permission::whereIn('id', $request->permission_ids)
            ->where('store_id', authStore())
            ->get();

        if ($permissions->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No valid permissions found',
            ], 404);
        }

        // Assign the permissions to the role
        $role->syncPermissions($permissions);

        return response()->json([
            'status' => 200,
            'message' => 'Permissions assigned successfully',
            'data' => [
                'role' => RoleResource::make($role->load('permissions')),
            ]
        ], 200);
    }

    public function revokeAllPermissions(Request $request)
    {
        $request->validate([
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $role = Role::where('store_id', authStore())->find($request->role_id);

        if (!$role) {
            return response()->json([
                'status' => 404,
                'message' => 'Role not found',
            ], 404);
        }

        // Revoke all permissions from the role
        $role->revokePermissionTo($role->permissions);

        return response()->json([
            'status' => 200,
            'message' => 'All permissions revoked successfully',
            'data' => [
                'role' => RoleResource::make($role->load('permissions')),
            ]
        ], 200);
    }
}
