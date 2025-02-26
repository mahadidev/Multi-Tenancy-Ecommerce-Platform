<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\WidgetInputResource;
use App\Models\Widget;
use App\Models\WidgetInput;
use Illuminate\Http\Request;

class StorePageWidgetInputController extends Controller
{

    public function index(Request $request, $pageWidgetId)
    {
        $sort = $request->input('sort'); // Sort order, 
        $perPage = $request->input('per_page'); // Items per page, 

        $pageWidget = Widget::with('widgetInputs')->find($pageWidgetId);

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
        $validateData =$request->validate([
            'parent_id' => 'nullable|exists:widget_inputs,id',
            'input_type_id' => ['required', 'exists:widget_input_types,id'],
            'name' => 'required|string',
            'label' => 'required|string',
            'placeholder' => 'nullable|string',
            'value' => 'nullable|string',
            'options' => 'nullable|array',
            'required' => 'nullable|boolean',

            'child' => 'nullable|array',
            'child.*.input_type_id' => ['required', 'exists:widget_input_types,id'],
            'child.*.name' => 'required|string',
            'child.*.label' => 'required|string',
            'child.*.placeholder' => 'nullable|string',
            'child.*.value' => 'nullable|string',
            'child.*.options' => 'nullable|array',
            'child.*.required' => 'nullable|boolean',
        ]);

        $pageWidget = Widget::find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found']);
        }

        $inputData = [
            'parent_id' => isset($validateData['parent_id']) ? $validateData['parent_id'] : null,
            'type_id' => $validateData['input_type_id'],
            'name' => $validateData['name'],
            'label' => $validateData['label'],
            'placeholder' => $validateData['placeholder'] ?? null,
            'value' => $validateData['value'] ?? null,
            'options' => isset($validateData['options']) ?  json_encode($validateData['options']) : null,
            'required' => $validateData['required'] ?? false,
        ];

        $storePageWidgetInput = $pageWidget->widgetInputs()->create($inputData);

        if(isset($validateData['child'])){
            foreach ($validateData['child'] as $key2 => $childInput) {
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

        return response()->json([
            'status' => 200,
            'message' => 'Page Widget Input created successfully',
            'data' => [
                'widget_input' => new WidgetInputResource($storePageWidgetInput)      
            ]
        ], 200);
    }

    public function show(Request $request, $pageWidgetId, $id)
    {
        $pageWidget = Widget::find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found'], 404);
        }

        $pageWidgetInput = WidgetInput::find($id);

        if (!$pageWidgetInput) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget Input not found'], 404);
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
        $validateData =$request->validate([
            'parent_id' => 'nullable|exists:widget_inputs,id',
            'input_type_id' => ['nullable', 'exists:widget_input_types,id'],
            'name' => 'nullable|string',
            'label' => 'nullable|string',
            'placeholder' => 'nullable|string',
            'value' => 'nullable|string',
            'options' => 'nullable|array',
            'required' => 'nullable|boolean',

            'child' => 'nullable|array',
            'child.*.input_type_id' => ['required', 'exists:widget_input_types,id'],
            'child.*.name' => 'required|string',
            'child.*.label' => 'required|string',
            'child.*.placeholder' => 'nullable|string',
            'child.*.value' => 'nullable|string',
            'child.*.options' => 'nullable|array',
            'child.*.required' => 'nullable|boolean',
        ]);

        $pageWidget = Widget::find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found']);
        }

        $pageWidgetInput = $pageWidget->widgetInputs()->find($id);

        if (!$pageWidgetInput) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget Input not found']);
        }

        $pageWidgetInput->update([
            'parent_id' => isset($validateData['parent_id']) ? $validateData['parent_id'] : $pageWidgetInput->parent_id,
            'type_id' => isset($validateData['input_type_id']) ? $validateData['input_type_id'] : $pageWidgetInput->type_id,
            'name' => isset($validateData['name']) ? $validateData['name'] : $pageWidgetInput->name,
            'label' => isset($validateData['label']) ? $validateData['label'] : $pageWidgetInput->label,
            'placeholder' => isset($validateData['placeholder']) ? $validateData['placeholder'] : $pageWidgetInput->placeholder,
            'value' => isset($validateData['value']) ? $validateData['value'] : $pageWidgetInput->value,
            'options' => isset($validateData['options']) ? json_encode($validateData['options']) : $pageWidgetInput->options,
            'required' => isset($validateData['required']) ? $validateData['required'] : $pageWidgetInput->required,
        ]);

        //add child here if exists
        if(isset($validateData['child'])){
            foreach ($validateData['child'] as $key2 => $childInput) {
                $inputData = [
                    'parent_id' => $pageWidgetInput->id,
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
        $pageWidget = Widget::find($pageWidgetId);

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
