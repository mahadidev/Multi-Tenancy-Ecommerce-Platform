<?php

namespace App\Http\Controllers\Api\v1\seller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\StorePage;
use App\Models\StorePageWidgetInput;
use App\Models\StorePageWidgetInputItem;
use App\Http\Resources\StorePageWidgetsResource;

class StorePageWidgetController extends Controller
{
    public function index(Request $request, $pageId)
    {
        $sort = $request->input('sort'); // Sort order, 
        $perPage = $request->input('per_page'); // Items per page, 

        $storePage = StorePage::where('id', $pageId)
            ->first();
        // $perPage = $request->input('per_page', 10); // Items per page, default is 10

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Page not found',
            ], 404);
        }

        $widgets = $storePage->widgets()
            ->when($sort, fn($query) => $query->orderBy('created_at', $sort), fn($query) => $query->latest());

        // Paginate or get all results based on the presence of `per_page`
        $paginated = $perPage ? $widgets->paginate($perPage) : $widgets->get();

        // Prepare the response
        $response = [
            'status' => 200,
            'data' => [
                'widgets' => StorePageWidgetsResource::collection($paginated),
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

    public function view(Request $request, $pageId, $widgetId)
    {
        $storePage = StorePage::where('id', $pageId)->first();

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Page not found',
            ], 404);
        }

        $widget = $storePage->widgets()->where('id', $widgetId)->first();

        if (!$widget) {
            return response()->json([
                'status' => 404,
                'message' => 'Widget not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'widget' => new StorePageWidgetsResource($widget),
            ],
        ], 200);
    }

    public function store(Request $request, $pageId)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
            'serial' => 'nullable|numeric',
            'thumbnail' => 'nullable|string',
            'is_editable' => 'nullable|boolean',
            'inputs' => 'nullable|array',
            'inputs.*.name' => 'required|string',
            'inputs.*.label' => 'required|string',
            'inputs.*.serial' => 'nullable|numeric',
            'inputs.*.placeholder' => 'nullable|string',
            'inputs.*.value' => 'nullable|string',
            'inputs.*.required' => 'nullable|boolean',
            'inputs.*.type' => 'required|string',
            'inputs.*.items' => 'nullable|array',
            'inputs.*.items.*.name' => 'required|string',
            'inputs.*.items.*.label' => 'required|string',
            'inputs.*.items.*.placeholder' => 'nullable|string',
            'inputs.*.items.*.value' => 'nullable|string',
            'inputs.*.items.*.required' => 'required|boolean',
            'inputs.*.items.*.type' => 'required|string',
        ]);

        $storePage = StorePage::where('id', $pageId)->first();

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Page not found',
            ], 404);
        }

        $widget = [
            'name' => $request->name,
            'label' => $request->label,
            'serial' => $request->serial,
            'is_editable' => $request->is_editable ?? 1,
        ];
        if ($request->serial) {
            $widget["serial"] = $request->serial;
        }
        $pageWidget = $storePage->widgets()->create($widget);

        if ($request->has('inputs')) {
            $pageWidget->widgetInputs()->delete();

            foreach ($request->inputs as $key => $input) {
                $pageWidgetInput = StorePageWidgetInput::create([
                    'widget_id' => $pageWidget->id,
                    'name' => $input['name'],
                    'label' => $input['label'],
                    'serial' => $input['serial'] ?? $key + 1,
                    'placeholder' => $input['placeholder'] ?? null,
                    'value' => $input['value'] ?? null,
                    'required' => $input['required'] ?? null,
                    'type' => $input['type'],
                ]);

                if (isset($input['items'])) {
                    $pageWidgetInput->items()->delete();

                    foreach ($input['items'] as $item) {
                        StorePageWidgetInputItem::create([
                            'widget_input_id' => $pageWidgetInput->id,
                            'name' => $item['name'],
                            'label' => $item['label'],
                            'placeholder' => $item['placeholder'] ?? null,
                            'value' => $item['value'],
                            'required' => $item['required'],
                            'type' => $item['type'] ?? "text",
                        ]);
                    }
                }
            }
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'widget' => new StorePageWidgetsResource($pageWidget),
            ],
        ], 200);
    }

    public function update(Request $request, $pageId, $widgetId)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
            'serial' => 'nullable|numeric',
            'thumbnail' => 'nullable|string',
            'is_editable' => 'nullable|boolean',
            'inputs' => 'nullable|array',
            'inputs.*.name' => 'required|string',
            'inputs.*.label' => 'required|string',
            'inputs.*.serial' => 'nullable|numeric',
            'inputs.*.placeholder' => 'nullable|string',
            'inputs.*.value' => 'nullable|string',
            'inputs.*.required' => 'required|boolean',
            'inputs.*.type' => 'required|string',
            'inputs.*.items' => 'nullable|array',
            'inputs.*.items.*.name' => 'required|string',
            'inputs.*.items.*.label' => 'required|string',
            'inputs.*.items.*.placeholder' => 'nullable|string',
            'inputs.*.items.*.value' => 'nullable|string',
            'inputs.*.items.*.required' => 'required|boolean',
            'inputs.*.items.*.type' => 'required|string',
        ]);

        $storePage = StorePage::where('id', $pageId)->first();

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Page not found',
            ], 404);
        }

        $pageWidget = $storePage->widgets()->where('id', $widgetId)->first();

        if (!$pageWidget) {
            return response()->json([
                'status' => 404,
                'message' => 'Widget not found',
            ], 404);
        }

        $pageWidget->update([
            'name' => $request->name,
            'label' => $request->label,
            'serial' => $request->serial ?? $pageWidget->serial,
            'is_editable' => $request->is_editable,
        ]);

        if ($request->has('inputs')) {
            $pageWidget->widgetInputs()->delete();

            foreach ($request->inputs as $key => $input) {
                $pageWidgetInput = StorePageWidgetInput::create([
                    'widget_id' => $pageWidget->id,
                    'name' => $input['name'],
                    'label' => $input['label'],
                    'serial' => isset($input['serial']) ? $input['serial'] : ($key + 1),
                    'placeholder' => $input['placeholder'],
                    'value' => $input['value'],
                    'required' => $input['required'],
                    'type' => $input['type'],
                ]);

                if (isset($input['items'])) {
                    $pageWidgetInput->items()->delete();

                    foreach ($input['items'] as $item) {
                        StorePageWidgetInputItem::create([
                            'widget_input_id' => $pageWidgetInput->id,
                            'name' => $item['name'],
                            'label' => $item['label'],
                            'placeholder' => $input['placeholder'],
                            'value' => $input['value'],
                            'required' => $input['required'],
                            'type' => $input['type'],
                        ]);
                    }
                }
            }
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'widget' => new StorePageWidgetsResource($pageWidget),
            ],
        ], 200);
    }

    public function destroy(Request $request, $pageId, $widgetId)
    {
        $storePage = StorePage::where('id', $pageId)->first();

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Page not found',
            ], 404);
        }

        $pageWidget = $storePage->widgets()->where('id', $widgetId)->first();

        if (!$pageWidget) {
            return response()->json([
                'status' => 404,
                'message' => 'Widget not found',
            ], 404);
        }

        $pageWidget->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Widget deleted successfully',
        ], 200);
    }
}
