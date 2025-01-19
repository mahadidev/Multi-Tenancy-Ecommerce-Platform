<?php

namespace App\Http\Controllers\Api\v1\seller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\StorePage;
use App\Http\Resources\StorePageWidgetsResource;

class StorePageWidgetController extends Controller
{
    public function index(Request $request, $pageId)
    {
        $storePage = StorePage::where('id', $pageId)->first();

        if(!$storePage){
            return response()->json([
                'status' => 404,
                'message' => 'Page not found'
            ]);
        }
       
        return response()->json([
            'status' => 200,
            'data' => [
                'widgets' => StorePageWidgetsResource::collection($storePage->widgets)
            ]
        ]);
    }

    public function view(Request $request, $pageId, $widgetId)
    {
        $storePage = StorePage::where('id', $pageId)->first();

        if(!$storePage){
            return response()->json([
                'status' => 404,
                'message' => 'Page not found'
            ]);
        }
        
        $widget = $storePage->widgets()->where('id', $widgetId)->first();
        
        if(!$widget){
            return response()->json([
                'status' => 404,
                'message' => 'Widget not found'
            ]);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'widget' => new StorePageWidgetsResource($widget)
            ]
        ]);
    }

    public function store(Request $request, $pageId)
    {

        $request->validate([
            'name' => 'required|string',
            'label' => 'required|string',
        ]);

        $storePage = StorePage::where('id', $pageId)->first();

        if(!$storePage){
            return response()->json([
                'status' => 404,
                'message' => 'Page not found'
            ]);
        }

        $widget = $storePage->widgets()->create([
            'name' => $request->name,
            'label' => $request->label,
        ]);


        
        return response()->json([
            'status' => 200,
            'data' => [
                'widget' => new StorePageWidgetsResource($widget)
            ]
        ]);
    }
}
