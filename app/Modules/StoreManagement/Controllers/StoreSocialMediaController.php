<?php

namespace App\Modules\StoreManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\StoreManagement\Models\StoreSocialMedia;
use App\Modules\StoreManagement\Resources\StoreSocialMediaResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StoreSocialMediaController extends Controller
{
    /**
     * Display a listing of the social media accounts for the current store.
     */
    public function index(Request $request)
    {
        $storeId = $request->attributes->get('store_id');
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'No store selected',
            ], 400);
        }

        $socialMedia = StoreSocialMedia::where('store_id', $storeId)->get();

        return response()->json([
            'status' => 200,
            'message' => 'Social media accounts retrieved successfully',
            'data' => [
                'store_social_media' => StoreSocialMediaResource::collection($socialMedia)
            ]
        ]);
    }

    /**
     * Store a newly created social media account for the current store.
     */
    public function store(Request $request)
    {
        $storeId = $request->attributes->get('store_id');
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'No store selected',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'url' => 'required|url',
            'label' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $socialMedia = StoreSocialMedia::create([
            'store_id' => $storeId,
            'name' => $request->name,
            'username' => $request->username,
            'url' => $request->url,
            'label' => $request->label ?? $request->name,
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Social media account added successfully',
            'data' => new StoreSocialMediaResource($socialMedia)
        ], 201);
    }

    /**
     * Update the specified social media account.
     */
    public function update(Request $request, $id)
    {
        $storeId = $request->attributes->get('store_id');
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'No store selected',
            ], 400);
        }

        $socialMedia = StoreSocialMedia::where('store_id', $storeId)
            ->where('id', $id)
            ->first();

        if (!$socialMedia) {
            return response()->json([
                'status' => 404,
                'message' => 'Social media account not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'username' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|url',
            'label' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $socialMedia->update($request->only(['name', 'username', 'url', 'label']));

        return response()->json([
            'status' => 200,
            'message' => 'Social media account updated successfully',
            'data' => new StoreSocialMediaResource($socialMedia)
        ]);
    }

    /**
     * Remove the specified social media account.
     */
    public function destroy(Request $request, $id)
    {
        $storeId = $request->attributes->get('store_id');
        
        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'No store selected',
            ], 400);
        }

        $socialMedia = StoreSocialMedia::where('store_id', $storeId)
            ->where('id', $id)
            ->first();

        if (!$socialMedia) {
            return response()->json([
                'status' => 404,
                'message' => 'Social media account not found',
            ], 404);
        }

        $socialMedia->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Social media account deleted successfully',
        ]);
    }
}