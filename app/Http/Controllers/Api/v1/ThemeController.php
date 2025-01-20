<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ThemeResource;
use App\Models\Theme;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function getThemes(Request $request)
    {
        $themes = Theme::with('pages.page_widgets')->active()->get();

        return response()->json(
            [
                'status' => 200,
                'data' => [
                    'themes' => ThemeResource::collection($themes),
                ],
            ],
            200,
        );
    }

    public function getTheme(Request $request, $id)
    {
        $theme = Theme::with('pages.page_widgets')
            ->active()
            ->where(['id' => $id])
            ->orWhere(['slug' => $id])
            ->first();

        if (!$theme) {
            response()->json(
                [
                    'status' => 404,
                    'data' => [
                        'theme' => null,
                    ],
                ],
                404,
            );
        }

        return response()->json(
            [
                'status' => 200,
                'data' => [
                    'theme' => new ThemeResource($theme),
                ],
            ],
            200,
        );
    }
}
