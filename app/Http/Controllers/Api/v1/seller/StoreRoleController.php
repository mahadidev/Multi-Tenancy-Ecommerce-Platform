<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class StoreRoleController extends Controller
{
    public function index(Request $request){
        $roles = Role::where('store_id', authStore())->latest()->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'roles' => RoleResource::collection($roles),
            ]
        ], 200);
    }

    public function store(Request $request){

        $request->validate([
            'name' => 'required|string',
        ]);

        $role = Role::updateOrCreate([
            'store_id' => authStore(),
            'name' => strtolower($request->name),
        ], [
            'guard_name' => 'web'
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Role created successfully',
            'data' => [
                'role' => RoleResource::make($role)
            ]
        ], 200);
    }

    public function show(Request $request, $id){
        $role = Role::where('store_id', authStore())->find($id);

        if (!$role) {
            return response()->json([
                'status' => 404,
                'message' => 'Role not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'role' => RoleResource::make($role),
            ]
        ], 200);
    }


    public function update(Request $request, $id){
        $request->validate([
            'name' => 'required|string',
        ]);

        $role = Role::where('store_id', authStore())->find($id);

        if (!$role) {
            return response()->json([
                'status' => 404,
                'message' => 'Role not found',
            ], 404);
        }

        $role->update([
            'name' => strtolower($request->name),
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Role updated successfully',
            'data' => [
                'role' => RoleResource::make($role),
            ]
        ], 200);
    }

    public function destroy(Request $request, $id){
        $role = Role::where('store_id', authStore())->find($id);

        if (!$role) {
            return response()->json([
                'status' => 404,
                'message' => 'Role not found',
            ], 404);
        }

        $role->permissions()->detach();
        $role->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Role deleted successfully',
        ], 200);
    }
}
