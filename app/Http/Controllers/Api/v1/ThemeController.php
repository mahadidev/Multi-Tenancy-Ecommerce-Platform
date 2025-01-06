<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ThemeResource;
use App\Models\Theme;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function getThemes(Request $request){

        $themes = Theme::with('widgets', 'pages.page_widgets')->active()->get();

        return response()->json([
            'status' => 200,
            'data' => [
                'themes' => ThemeResource::collection($themes)
            ]
        ]);
    }

    public function getTheme(Request $request, $id){
        
        return apiResponse(function () use ($request, $id) {
            $theme = Theme::with('widgets', 'pages.page_widgets')->active()->findorfail($id);
            return response()->json([
                'status' => 200,
                'data' => [
                    'theme' => new ThemeResource($theme)
                ]
            ]);
        });
    }

}
