<?php

namespace App\Modules\ContentManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageTypeResource;
use Illuminate\Http\Request;
use App\Modules\ContentManagement\Models\PageType;

class PageTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pageTypes = PageType::latest()->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'page_types' => PageTypeResource::collection($pageTypes),
            ],
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'label' => 'required|string',
        ]);

        $pageType = PageType::create($request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Page type created successfully.',
            'data' => [
                'page_type' => new PageTypeResource($pageType),
            ],
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pageType = PageType::find($id);

        if (!$pageType) {
            return response()->json([
                'status' => 404,
                'message' => 'Page type not found.',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'page_type' => new PageTypeResource($pageType),
            ],
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'type' => 'required|string',
            'label' => 'required|string',
        ]);

        $pageType = PageType::find($id);

        if (!$pageType) {
            return response()->json([
                'status' => 404,
                'message' => 'Page type not found.',
            ]);
        }

        $pageType->update($request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Page type updated successfully.',
            'data' => [
                'page_type' => new PageTypeResource($pageType),
            ],
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pageType = PageType::find($id);

        if (!$pageType) {
            return response()->json([
                'status' => 404,
                'message' => 'Page type not found.',
            ], 404);
        }
        
        $pageType->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Page type deleted successfully.',
        ], 200);
    }
}