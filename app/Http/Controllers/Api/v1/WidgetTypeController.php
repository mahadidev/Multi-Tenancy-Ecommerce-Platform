<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WidgetTypeResource;
use App\Models\WidgetType;
use Illuminate\Http\Request;

class WidgetTypeController extends Controller
{
    public function index(Request $request)
    {
        $widget_types = WidgetType::get();

        return response()->json([
            'status' => 200,
            'data' => [
                'widget_types' => WidgetTypeResource::collection($widget_types),
            ],
        ]);
    }
}
