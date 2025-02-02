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
        $sort = $request->input('sort'); // Sort order, 
        $perPage = $request->input('per_page'); // Items per page, 
        $pageWidgetInput = StorePageWidgetInput::with('items')->find($inputId);

        if (!$pageWidgetInput) {
            return response()->json(['status' => 404, 'message' => 'Widget Input not found'], 404);
        }

        // $per_page = $request->input('per_page', 10);
        $widgetInputItems = $pageWidgetInput->items()
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $widgetInputItems->paginate($perPage) : $widgetInputItems->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'widget_input_items' => StorePageWidgetInputItemsResource::collection($paginated),
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
        ], 200);
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
        ], 200);
    }

    public function destroy(Request $request, $inputId, $itemId)
    {
        $pageWidgetInput = StorePageWidgetInput::find($inputId);

        if (!$pageWidgetInput) {
            return response()->json(['status' => 404, 'message' => 'Widget Input not found'], 404);
        }

        $pageWidgetInputItem = $pageWidgetInput->items()->find($itemId);

        if (!$pageWidgetInputItem) {
            return response()->json(['status' => 404, 'message' => 'Widget Input Item not found'], 404);
        }

        $pageWidgetInputItem->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Widget Input Item deleted successfully',
        ], 200);
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
        ], 200);
    }
}
