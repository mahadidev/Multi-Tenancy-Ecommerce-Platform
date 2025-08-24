<?php

namespace App\Modules\ContentManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ContentManagement\Resources\WidgetTypeResource;
use App\Modules\ContentManagement\Models\WidgetType;
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