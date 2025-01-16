<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageTypeResource;
use Illuminate\Http\Request;
use App\Models\PageType;

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
            'data' => PageTypeResource::collection($pageTypes),
        ]);
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
            'data' => new PageTypeResource($pageType),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pageType = PageType::find($id);

        return response()->json([
            'status' => 200,
            'data' => new PageTypeResource($pageType),
        ]);
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
        $pageType->update($request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Page type updated successfully.',
            'data' => new PageTypeResource($pageType),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pageType = PageType::find($id);
        $pageType->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Page type deleted successfully.',
        ]);
    }
}
