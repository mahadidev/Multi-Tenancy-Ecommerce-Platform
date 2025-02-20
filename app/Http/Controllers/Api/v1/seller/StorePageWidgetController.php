<?php

namespace App\Http\Controllers\Api\v1\seller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\StorePage;
use App\Http\Resources\WidgetResource;

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
                'widgets' => WidgetResource::collection($paginated),
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
                'widget' => new WidgetResource($widget),
            ],
        ], 200);
    }

    public function store(Request $request, $pageId)
    {
        $widget = $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
            'serial' => 'nullable|numeric',
            'thumbnail' => 'nullable|string',
            'widget_type_id' => 'required|exists:widget_types,id',

            'inputs' => 'nullable|array',
            'inputs.*.parent_id' => 'nullable|exists:widget_inputs,id',
            'inputs.*.input_type_id' => ['required', 'exists:widget_input_types,id'],
            'inputs.*.name' => 'required|string',
            'inputs.*.label' => 'required|string',
            'inputs.*.placeholder' => 'nullable|string',
            'inputs.*.value' => 'nullable|string',
            'inputs.*.options' => 'nullable|array',
            'inputs.*.required' => 'nullable|boolean',


            'inputs.child' => 'nullable|array',
            'inputs.*.child.*.input_type_id' => ['required', 'exists:widget_input_types,id'],
            'inputs.*.child.*.name' => 'required|string',
            'inputs.*.child.*.label' => 'required|string',
            'inputs.*.child.*.placeholder' => 'nullable|string',
            'inputs.*.child.*.value' => 'nullable|string',
            'inputs.*.child.*.options' => 'nullable|array',
            'inputs.*.child.*.required' => 'nullable|boolean',
        ]);

        $storePage = StorePage::authorized()->where('id', $pageId)->first();

        if (!$storePage) {
            return response()->json([
                'status' => 404,
                'message' => 'Store Page not found',
            ], 404);
        }

        $widgetData = [
            'name' => $widget['name'],
            'label' => $widget['label'],
            'type_id' => $widget['widget_type_id'] ?? 3,
            'thumbnail' => $widget['thumbnail'] ?? null,
        ];

        $storePageWidget = $storePage->widgets()->create($widgetData);

        // Create the inputs for the widget
        if (isset($widget['inputs'])) {
            foreach ($widget['inputs'] as $key2 => $input) {
                $inputData = [
                    'parent_id' => isset($input['parent_id']) ? $input['parent_id'] : null,
                    'type_id' => $input['input_type_id'],
                    'name' => $input['name'],
                    'label' => $input['label'],
                    'placeholder' => $input['placeholder'] ?? null,
                    'value' => $input['value'] ?? null,
                    'options' => isset($input['options']) ?  json_encode($input['options']) : null,
                    'required' => $input['required'] ?? false,
                ];

                $storePageWidgetInput = $storePageWidget->widgetInputs()->create($inputData);

                if(isset($input['child'])){
                    foreach ($input['child'] as $key2 => $childInput) {
                        $inputData = [
                            'parent_id' => $storePageWidgetInput->id,
                            'type_id' => $childInput['input_type_id'],
                            'name' => $childInput['name'],
                            'label' => $childInput['label'],
                            'placeholder' => $childInput['placeholder'] ?? null,
                            'value' => $childInput['value'] ?? null,
                            'options' => isset($childInput['options']) ? json_encode($childInput['options']) : null,
                            'required' => $childInput['required'] ?? false,
                        ];

                        $storePageWidgetInputChild = $storePageWidget->widgetInputs()->create($inputData);
                    }
                }
            }
        }
     
        return response()->json([
            'status' => 200,
            'data' => [
                'widget' => new WidgetResource($storePageWidget),
            ],
        ], 200);
    }

    public function update(Request $request, $pageId, $widgetId)
    {
        $validatedData = $request->validate([
            'name' => 'nullable|string',
            'label' => 'nullable|string',
            'serial' => 'nullable|numeric',
            'thumbnail' => 'nullable|string',
            'widget_type_id' => 'nullable|exists:widget_types,id',

            'inputs' => 'nullable|array',
            'inputs.*.parent_id' => 'nullable|exists:widget_inputs,id',
            'inputs.*.input_type_id' => ['required', 'exists:widget_input_types,id'],
            'inputs.*.name' => 'required|string',
            'inputs.*.label' => 'required|string',
            'inputs.*.placeholder' => 'nullable|string',
            'inputs.*.value' => 'nullable|string',
            'inputs.*.options' => 'nullable|array',
            'inputs.*.required' => 'nullable|boolean',


            'inputs.child' => 'nullable|array',
            'inputs.*.child.*.input_type_id' => ['required', 'exists:widget_input_types,id'],
            'inputs.*.child.*.name' => 'required|string',
            'inputs.*.child.*.label' => 'required|string',
            'inputs.*.child.*.placeholder' => 'nullable|string',
            'inputs.*.child.*.value' => 'nullable|string',
            'inputs.*.child.*.options' => 'nullable|array',
            'inputs.*.child.*.required' => 'nullable|boolean',
        ]);

        $storePage = StorePage::authorized()->where('id', $pageId)->first();

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
            'name' => isset($validatedData['name']) ? $validatedData['name'] : $pageWidget->name,
            'label' => isset($validatedData['label']) ? $validatedData['label'] : $pageWidget->label,
            'serial' => isset($validatedData['serial']) ? $validatedData['serial'] : $pageWidget->serial,
            'thumbnail' => isset($validatedData['thumbnail']) ? $validatedData['thumbnail'] : $pageWidget->thumbnail,
            'type_id' => isset($validatedData['widget_type_id']) ? $validatedData['widget_type_id'] : $pageWidget->type_id,
        ]);

        if (isset($validatedData['inputs'])) {

            $pageWidget->widgetInputs()->delete();

            foreach ($validatedData['inputs'] as $key2 => $input) {
                $inputData = [
                    'parent_id' => isset($input['parent_id']) ? $input['parent_id'] : null,
                    'type_id' => $input['input_type_id'],
                    'name' => $input['name'],
                    'label' => $input['label'],
                    'placeholder' => $input['placeholder'] ?? null,
                    'value' => $input['value'] ?? null,
                    'options' => isset($input['options']) ?  json_encode($input['options']) : null,
                    'required' => $input['required'] ?? false,
                ];

                $storePageWidgetInput = $pageWidget->widgetInputs()->create($inputData);

                if(isset($input['child'])){
                    foreach ($input['child'] as $key3 => $childInput) {
                        $inputData = [
                            'parent_id' => $storePageWidgetInput->id,
                            'type_id' => $childInput['input_type_id'],
                            'name' => $childInput['name'],
                            'label' => $childInput['label'],
                            'placeholder' => $childInput['placeholder'] ?? null,
                            'value' => $childInput['value'] ?? null,
                            'options' => isset($childInput['options']) ? json_encode($childInput['options']) : null,
                            'required' => $childInput['required'] ?? false,
                        ];

                        $storePageWidgetInputChild = $pageWidget->widgetInputs()->create($inputData);
                    }
                }
            }
        }
     

        return response()->json([
            'status' => 200,
            'data' => [
                'widget' => new WidgetResource($pageWidget),
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
