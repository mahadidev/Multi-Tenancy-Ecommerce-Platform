<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StorePageWidget;
use App\Http\Resources\WidgetInputResource;

class WidgetInputController extends Controller
{
    public function index(Request $request, $pageWidgetId)
    {
        $sort = $request->input('sort'); // Sort order, 
        $perPage = $request->input('per_page'); // Items per page, 

        $pageWidget = StorePageWidget::with('widgetInputs')->find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found'], 404);
        }

        // $per_page = $request->input('per_page', 10);

        $widgetInput = $pageWidget->widgetInputs()
        ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $widgetInput->paginate($perPage) : $widgetInput->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'widget_inputs' => WidgetInputResource::collection($paginated),
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

    public function store(Request $request,  $pageWidgetId)
    {
        $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
            'serial' => 'required|numeric',
            'placeholder' => 'nullable|string',
            'value' => 'nullable|string',
            'required' => 'required|boolean',
            'type' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.name' => 'required|string',
            'items.*.label' => 'required|string',
            'items.*.placeholder' => 'nullable|string',
            'items.*.value' => 'nullable|string',
            'items.*.required' => 'required|boolean',
            'items.*.type' => 'required|string',
        ]);

        $pageWidget = StorePageWidget::find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found']);
        }

        $pageWidgetInput =  $pageWidget->widgetInputs()->create($request->all());

        if ($request->has('items')) {

            $pageWidgetInput->items()->delete();
            $pageWidgetInput->items()->createMany($request->items);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Page Widget Input created successfully',
            'data' => [
                'widget_input' => new WidgetInputResource($pageWidgetInput)      
            ]
        ], 200);
    }

    public function show(Request $request, $pageWidgetId, $id)
    {
        $pageWidget = StorePageWidget::with('widgetInputs')->find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found']);
        }

        $pageWidgetInput = $pageWidget->widgetInputs()->find($id);

        if (!$pageWidgetInput) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget Input not found']);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'widget_input' => new WidgetInputResource($pageWidgetInput) 
            ]
        ], 200);
    }

    public function update(Request $request, $pageWidgetId, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
            'serial' => 'required|numeric',
            'placeholder' => 'nullable|string',
            'value' => 'nullable|string',
            'required' => 'required|boolean',
            'type' => 'nullable|string',
            'items' => 'nullable|array',
            'items.*.name' => 'required|string',
            'items.*.label' => 'required|string',
            'items.*.placeholder' => 'nullable|string',
            'items.*.value' => 'nullable|string',
            'items.*.required' => 'required|boolean',
            'items.*.type' => 'required|string',
        ]);

        $pageWidget = StorePageWidget::find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found']);
        }

        $pageWidgetInput = $pageWidget->widgetInputs()->find($id);

        if (!$pageWidgetInput) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget Input not found']);
        }

        $pageWidgetInput->update($request->all());

        if ($request->has('items')) {

            $pageWidgetInput->items()->delete();
            $pageWidgetInput->items()->createMany($request->items);
        }
        
        return response()->json([
            'status' => 200,
            'message' => 'Page Widget Input updated successfully',
            'data' => [
                'widget_input' => new WidgetInputResource($pageWidgetInput) 
            ]
        ]);
    }

    public function destroy(Request $request, $pageWidgetId, $id)
    {
        $pageWidget = StorePageWidget::find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found'], 404);
        }

        $pageWidgetInput = $pageWidget->widgetInputs()->find($id);

        if (!$pageWidgetInput) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget Input not found'], 404);
        }

        $pageWidgetInput->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Page Widget Input deleted successfully'
        ], 200);
    }
}
