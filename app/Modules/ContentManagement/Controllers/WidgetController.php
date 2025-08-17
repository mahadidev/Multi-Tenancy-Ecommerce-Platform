<?php

namespace App\Modules\ContentManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\WidgetResource;
use App\Modules\ContentManagement\Services\WidgetService;
use Illuminate\Http\Request;

class WidgetController extends Controller
{
    public function index(Request $request, $id = null)
    {
        // If an ID is provided, fetch a single widget
        if ($id) {
            $widget = WidgetService::getWidgetById($id, $request);
            if ($widget) {
                return response()->json([
                    'status' => 200,
                    'data' => new WidgetResource($widget)
                ]);
            } else {
                return response()->json([
                    'status' => 404,
                    'message' => 'Widget not found'
                ], 404);
            }
        }

        // Otherwise, fetch all widgets
        $widgets = WidgetService::getWidgets($request);
        
        return response()->json([
            'status' => 200,
            'data' => [
                'widgets' => WidgetResource::collection($widgets)
            ]
        ]);
    }

}