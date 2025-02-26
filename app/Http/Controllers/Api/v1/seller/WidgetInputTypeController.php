<?php

namespace App\Http\Controllers\Api\v1\seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WidgetInputType;
use App\Http\Resources\WidgetInputTypeResource;
class WidgetInputTypeController extends Controller
{
    public function index(Request $request)
    {
        $widgetInputTypes = WidgetInputType::get();

        return response()->json([
            'success' => 200,
            'data' => [
                'widget_input_types' => WidgetInputTypeResource::collection($widgetInputTypes),
            ],
        ]);
    }

    public function show(Request $request, $id)
    {
        $widgetInputType = WidgetInputType::find($id);

        if (!$widgetInputType) {
            return response()->json([
                'error' => 404,
                'message' => 'Widget Input Type not found',
            ], 404);
        }

        return response()->json([
            'success' => 200,
            'data' => [
                'widget_input_type' => new WidgetInputTypeResource($widgetInputType),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string',
            'value' => 'required|string',
        ]);

        $widgetInputType = WidgetInputType::create([
            'label' => $request->label,
            'value' => $request->value,
        ]);

        return response()->json([
            'success' => 200,
            'message' => 'Widget Input Type created successfully',
            'data' => [
                'widget_input_type' => new WidgetInputTypeResource($widgetInputType),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $widgetInputType = WidgetInputType::find($id);

        if (!$widgetInputType) {
            return response()->json([
                'error' => 404,
                'message' => 'Widget Input Type not found',
            ], 404);
        }

        $request->validate([
            'label' => 'required|string',
            'value' => 'required|string',
        ]);

        $widgetInputType->update([
            'label' => $request->label,
            'value' => $request->value,
        ]);

        return response()->json([
            'success' => 200,
            'message' => 'Widget Input Type updated successfully',
            'data' => [
                'widget_input_type' => new WidgetInputTypeResource($widgetInputType),
            ],
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $widgetInputType = WidgetInputType::find($id);

        if (!$widgetInputType) {
            return response()->json([
                'error' => 404,
                'message' => 'Widget Input Type not found',
            ], 404);
        }

        $widgetInputType->delete();

        return response()->json([
            'success' => 200,
            'message' => 'Widget Input Type deleted successfully',
        ]);
    }
    
}
