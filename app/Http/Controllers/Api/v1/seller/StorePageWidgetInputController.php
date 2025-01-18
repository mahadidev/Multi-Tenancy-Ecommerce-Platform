<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use App\Http\Resources\StorePagesResource;
use App\Http\Resources\StoreResource;
use App\Models\Store;
use App\Models\StorePage;
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
                'widget_inputs' => $pageWidget->widgetInputs
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
        ]);

        $pageWidget = StorePageWidget::find($pageWidgetId);

        if (!$pageWidget) {
            return response()->json([ 'status' => 404 ,'message' => 'Widget not found']);
        }

        $pageWidgetInput =  $pageWidget->widgetInputs()->create($request->all());

        return response()->json([
            'status' => 200,
            'message' => 'Page Widget Input created successfully',
            'data' => [
                'widget_input' => $pageWidgetInput     
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
                'widget_input' => $pageWidgetInput
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

        return response()->json([
            'status' => 200,
            'message' => 'Page Widget Input updated successfully',
            'data' => [
                'widget_input' => $pageWidgetInput
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
