<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StoreSocialMedia;
use Illuminate\Validation\Rule;
use App\Http\Resources\StoreSocialMediaResource;

class StoreSocialMediaController extends Controller
{
    public function index(Request $request)
    {
        $query = StoreSocialMedia::authoriedStore();

        if ($request->has('media_name')) {
            $query->where('name', $request->input('media_name'));
        }

        if ($request->has('media_username')) {
            $query->where('name', $request->input('media_username'));
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('url', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 10); // Default items per page is 10
        $storeSocialMedia = $query->paginate($perPage)->appends($request->only(['media_name', 'media_username', 'search', 'per_page']));

        return response()->json([
            'status' => 200,
            'message' => 'Social media retrieved successfully',
            'data' => [
                'store_social_media' => StoreSocialMediaResource::collection($storeSocialMedia),
            ],
            'meta' => [
                'current_page' => $storeSocialMedia->currentPage(),
                'first_page_url' => $storeSocialMedia->url(1),
                'last_page' => $storeSocialMedia->lastPage(),
                'last_page_url' => $storeSocialMedia->url($storeSocialMedia->lastPage()),
                'next_page_url' => $storeSocialMedia->nextPageUrl(),
                'prev_page_url' => $storeSocialMedia->previousPageUrl(),
                'total' => $storeSocialMedia->total(),
                'per_page' => $storeSocialMedia->perPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'username' => 'required|string',
            'url' => 'required|url',
        ]);

        // Add the store_id to the validated data
        $validated = array_merge($validated, ['store_id' => authStore()]);

        // Check if the name exists for the current store_id, and use firstOrCreate
        $storeSocialMedia = StoreSocialMedia::firstOrCreate(
            [
                'name' => $validated['name'],
                'store_id' => $validated['store_id'],
            ],
            $validated, // The attributes to fill if the record doesn't exist
        );

        return response()->json([
            'status' => 200,
            'message' => 'Social media added successfully',
            'data' => [
                'store_social_media' => new StoreSocialMediaResource($storeSocialMedia),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $storeSocialMedia = StoreSocialMedia::authoriedStore()->find($id);
    
        if (!$storeSocialMedia) {
            return response()->json([
                'status' => 404,
                'message' => 'Social media not found',
            ]);
        }
    
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                // Ensure the name is unique under the same store_id, excluding the current record
                Rule::unique('store_social_media')->where(function ($query) use ($storeSocialMedia) {
                    return $query->where('store_id', $storeSocialMedia->store_id);
                })->ignore($id),
            ],
            'username' => 'required|string',
            'url' => 'required|string',
        ]);
    
        $validated = array_merge($validated, ['store_id' => authStore()]);
        $storeSocialMedia->update($validated);
    
        return response()->json([
            'status' => 200,
            'message' => 'Social media updated successfully',
            'data' => [
                'store_social_media' => StoreSocialMediaResource::collection($storeSocialMedia),
            ],
        ]);
    }
    

    public function destroy($id)
    {
        $storeSocialMedia = StoreSocialMedia::authoriedStore()->find($id);

        if (!$storeSocialMedia) {
            return response()->json([
                'status' => 404,
                'message' => 'Social media not found',
            ]);
        }

        $storeSocialMedia->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Social media deleted successfully',
        ]);
    }

    public function show($id)
    {
        $storeSocialMedia = StoreSocialMedia::authoriedStore()->find($id);

        if (!$storeSocialMedia) {
            return response()->json([
                'status' => 404,
                'message' => 'Social media not found',
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Social media retrieved successfully',
            'data' => [
                'store_social_media' => $storeSocialMedia,
            ],
        ]);
    }
}
