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
        $storePage = StorePage::where('id', $pageId)->first();
        $perPage = $request->input('per_page', 10); // Items per page, default is 10

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Page not found',
            ], 404);
        }

        $widgets = $storePage->widgets()->paginate($perPage);

        return response()->json([
            'status' => 200,
            'data' => [
                'widgets' => StorePageWidgetsResource::collection($widgets),
            ],
            'meta' => [
                'current_page' => $widgets->currentPage(),
                'first_page_url' => $widgets->url(1),
                'last_page' => $widgets->lastPage(),
                'last_page_url' => $widgets->url($widgets->lastPage()),
                'next_page_url' => $widgets->nextPageUrl(),
                'prev_page_url' => $widgets->previousPageUrl(),
                'total' => $widgets->total(),
                'per_page' => $widgets->perPage(),
            ],
        ], 200);
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
            'thumbnail' => 'nullable|string',
            'inputs' => 'nullable|array',
            'inputs.*.name' => 'required|string',
            'inputs.*.label' => 'required|string',
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
            'inputs.*.items.*.type' => 'nullable|string',
        ]);

        $storePage = StorePage::where('id', $pageId)->first();

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Page not found',
            ]);
        }

        $pageWidget = $storePage->widgets()->create([
            'name' => $request->name,
            'label' => $request->label,
        ]);

        if ($request->has('inputs')) {
            $pageWidget->widgetInputs()->delete();

            foreach ($request->inputs as $input) {
                $pageWidgetInput = StorePageWidgetInput::create([
                    'widget_id' => $pageWidget->id,
                    'name' => $input['name'],
                    'label' => $input['label'],
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
        ]);
    }

    public function update(Request $request, $pageId, $widgetId)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
            'inputs' => 'nullable|array',
            'inputs.*.name' => 'required|string',
            'inputs.*.label' => 'required|string',
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
            'inputs.*.items.*.type' => 'nullable|string',
        ]);

        $storePage = StorePage::where('id', $pageId)->first();

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Page not found',
            ]);
        }

        $pageWidget = $storePage->widgets()->where('id', $widgetId)->first();

        if (!$pageWidget) {
            return response()->json([
                'status' => 404,
                'message' => 'Widget not found',
            ]);
        }

        $pageWidget->update([
            'name' => $request->name,
            'label' => $request->label,
        ]);

        if ($request->has('inputs')) {
            $pageWidget->widgetInputs()->delete();

            foreach ($request->inputs as $input) {
                $pageWidgetInput = StorePageWidgetInput::create([
                    'widget_id' => $pageWidget->id,
                    'name' => $input['name'],
                    'label' => $input['label'],
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
        ]);
    }

    public function destroy(Request $request, $pageId, $widgetId)
    {
        $storePage = StorePage::where('id', $pageId)->first();

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Page not found',
            ]);
        }

        $pageWidget = $storePage->widgets()->where('id', $widgetId)->first();

        if (!$pageWidget) {
            return response()->json([
                'status' => 404,
                'message' => 'Widget not found',
            ]);
        }

        $pageWidget->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Widget deleted successfully',
        ]);
    }
}
