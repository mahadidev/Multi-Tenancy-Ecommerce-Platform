<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\StorePageWidgetInputsResource;
use App\Models\StorePageWidget;
use Illuminate\Http\Request;

class StorePageWidgetInputController extends Controller
{

    public function index(Request $request, $pageWidgetId)
    {
        $pageWidget = StorePageWidget::with('widgetInputs')->find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found']);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'widget_inputs' => StorePageWidgetInputsResource::collection($pageWidget->widgetInputs)
            ]
        ]);
    }

    public function store(Request $request,  $pageWidgetId)
    {
        $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
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
            'items.*.type' => 'nullable|string',
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
                'widget_input' => new StorePageWidgetInputsResource($pageWidgetInput)      
            ]
        ]);
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
                'widget_input' => new StorePageWidgetInputsResource($pageWidgetInput) 
            ]
        ]);
    }

    public function update(Request $request, $pageWidgetId, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
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
            'items.*.type' => 'nullable|string',
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
                'widget_input' => new StorePageWidgetInputsResource($pageWidgetInput) 
            ]
        ]);
    }

    public function destroy(Request $request, $pageWidgetId, $id)
    {
        $pageWidget = StorePageWidget::find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found']);
        }

        $pageWidgetInput = $pageWidget->widgetInputs()->find($id);

        if (!$pageWidgetInput) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget Input not found']);
        }

        $pageWidgetInput->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Page Widget Input deleted successfully'
        ]);
    }
}
