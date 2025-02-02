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
                    ->orWhere('label', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('url', 'like', "%{$search}%");
            });
        }

        $sort = $request->input('sort'); // Sort order, 
        $perPage = $request->input('per_page'); // Items per page, 

        $storeSocialMedia = $query
        ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $storeSocialMedia->paginate($perPage) : $storeSocialMedia->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'store_social_media' => StoreSocialMediaResource::collection($paginated),
            ],
        ];

        // Add pagination meta data if `per_page` is provided
        if ($perPage) {
            $response['meta'] = [
                'current_page' => $paginated->currentPage(),
                'first_page_url' => $paginated->url(1),
                'last_page' => $paginated->lastPage(),
                'last_page_url' => $paginated->url($paginated->lastPage()),
                'next_page_url' => $paginated->nextPageUrl(),
                'prev_page_url' => $paginated->previousPageUrl(),
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
            ];
        }

        return response()->json($response, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'username' => 'required|string',
            'label' => 'required|string',
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
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $storeSocialMedia = StoreSocialMedia::authoriedStore()->find($id);

        if (!$storeSocialMedia) {
            return response()->json([
                'status' => 404,
                'message' => 'Social media not found',
            ], 404);
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
            'label' => 'required|string',
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
        ], 200);
    }


    public function destroy($id)
    {
        $storeSocialMedia = StoreSocialMedia::authoriedStore()->find($id);

        if (!$storeSocialMedia) {
            return response()->json([
                'status' => 404,
                'message' => 'Social media not found',
            ], 404);
        }

        $storeSocialMedia->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Social media deleted successfully',
        ], 200);
    }

    public function show($id)
    {
        $storeSocialMedia = StoreSocialMedia::authoriedStore()->find($id);

        if (!$storeSocialMedia) {
            return response()->json([
                'status' => 404,
                'message' => 'Social media not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Social media retrieved successfully',
            'data' => [
                'store_social_media' => $storeSocialMedia,
            ],
        ], 200);
    }
}
