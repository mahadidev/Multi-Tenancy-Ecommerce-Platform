<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use App\Http\Resources\PermissionResource;

class StorePermissionController extends Controller
{
    public function index(Request $request){
        
        $permissions = Permission::where('store_id', authStore())->latest()->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'permissions' => PermissionResource::collection($permissions),
            ]
        ], 200);
    }

    public function store(Request $request){

        $request->validate([
            'name' => 'required|string',
        ]);

        $permission = Permission::updateOrCreate([
            'store_id' => authStore(),
            'name' => $request->name,
        ], [
            'guard_name' => 'web'
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Permission created successfully',
            'data' => [
                'permission' => PermissionResource::make($permission),
            ]
        ], 200);
    }

    public function update(Request $request, $id){

        $request->validate([
            'name' => 'required|string',
        ]);

        $permission = Permission::where('store_id', authStore())->find($id);

        if(!$permission){
            return response()->json([
                'status' => 404,
                'message' => 'Permission not found',
            ], 404);
        }

        $permission->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Permission updated successfully',
            'data' => [
                'permission' => PermissionResource::make($permission),
            ]
        ], 200);
    }

    public function show(Request $request, $id){

        $permission = Permission::where('store_id', authStore())->find($id);

        if(!$permission){
            return response()->json([
                'status' => 404,
                'message' => 'Permission not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'permission' => PermissionResource::make($permission),
            ]
        ], 200);
    }

    public function destroy(Request $request, $id){

        $permission = Permission::where('store_id', authStore())->find($id);

        if(!$permission){
            return response()->json([
                'status' => 404,
                'message' => 'Permission not found',
            ], 404);
        }

         // Detach permission from all roles before deleting
        $permission->roles()->detach();
    
        $permission->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Permission deleted successfully',
        ], 200);
    }
}
