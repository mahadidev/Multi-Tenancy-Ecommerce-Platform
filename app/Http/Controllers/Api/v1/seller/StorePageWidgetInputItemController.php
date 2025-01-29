<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StorePageWidget;
use App\Models\StorePageWidgetInput;
use App\Http\Resources\StorePageWidgetInputItemsResource;

class StorePageWidgetInputItemController extends Controller
{
    public function index(Request $request, $inputId)
    {
        $pageWidgetInput = StorePageWidgetInput::with('items')->find($inputId);

        if (!$pageWidgetInput) {
            return response()->json(['status' => 404, 'message' => 'Widget Input not found'], 404);
        }

        // $per_page = $request->input('per_page', 10);
        $widgetInputItems = $pageWidgetInput->items()
                                            ->latest()
                                            ->get();
                                    // ->paginate($per_page);

        return response()->json([
            'status' => 200,
            'data' => [
                'widget_input_items' => StorePageWidgetInputItemsResource::collection($widgetInputItems),
            ],
            // 'meta' => [
            //     'current_page' => $widgetInputItems->currentPage(),
            //     'first_page_url' => $widgetInputItems->url(1),
            //     'last_page' => $widgetInputItems->lastPage(),
            //     'last_page_url' => $widgetInputItems->url($widgetInputItems->lastPage()),
            //     'next_page_url' => $widgetInputItems->nextPageUrl(),
            //     'prev_page_url' => $widgetInputItems->previousPageUrl(),
            //     'total' => $widgetInputItems->total(),
            //     'per_page' => $widgetInputItems->perPage(),
            // ],
        ], 200);
    }

    public function store(Request $request, $inputId)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
            'placeholder' => 'nullable|string',
            'value' => 'nullable|string',
            'required' => 'required|boolean',
            'type' => 'required|string',
        ]);

        $pageWidgetInput = StorePageWidgetInput::find($inputId);

        if (!$pageWidgetInput) {
            return response()->json(['status' => 404, 'message' => 'Widget Input not found']);
        }

        $pageWidgetInputItem = $pageWidgetInput->items()->create($validatedData);

        return response()->json([
            'status' => 200,
            'data' => [
                'widget_input_item' => new StorePageWidgetInputItemsResource($pageWidgetInputItem),
            ],
        ]);
    }

    public function update(Request $request, $inputId, $itemId)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
            'placeholder' => 'nullable|string',
            'value' => 'nullable|string',
            'required' => 'required|boolean',
            'type' => 'required|string',
        ]);

        $pageWidgetInput = StorePageWidgetInput::find($inputId);

        if (!$pageWidgetInput) {
            return response()->json(['status' => 404, 'message' => 'Widget Input not found']);
        }

        $pageWidgetInputItem = $pageWidgetInput->items()->find($itemId);

        if (!$pageWidgetInputItem) {
            return response()->json(['status' => 404, 'message' => 'Widget Input Item not found']);
        }

        $pageWidgetInputItem->update($validatedData);

        return response()->json([
            'status' => 200,
            'data' => [
                'widget_input_item' => new StorePageWidgetInputItemsResource($pageWidgetInputItem),
            ],
        ]);
    }

    public function destroy(Request $request, $inputId, $itemId)
    {
        $pageWidgetInput = StorePageWidgetInput::find($inputId);

        if (!$pageWidgetInput) {
            return response()->json(['status' => 404, 'message' => 'Widget Input not found']);
        }

        $pageWidgetInputItem = $pageWidgetInput->items()->find($itemId);

        if (!$pageWidgetInputItem) {
            return response()->json(['status' => 404, 'message' => 'Widget Input Item not found']);
        }

        $pageWidgetInputItem->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Widget Input Item deleted successfully',
        ]);
    }

    public function show(Request $request, $inputId, $itemId)
    {
        $pageWidgetInput = StorePageWidgetInput::with('items')->find($inputId);

        if (!$pageWidgetInput) {
            return response()->json(['status' => 404, 'message' => 'Widget Input not found']);
        }

        $pageWidgetInputItem = $pageWidgetInput->items()->find($itemId);

        if (!$pageWidgetInputItem) {
            return response()->json(['status' => 404, 'message' => 'Widget Input Item not found']);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'widget_input_item' => new StorePageWidgetInputItemsResource($pageWidgetInputItem), 
            ],
        ]);
    }
}
