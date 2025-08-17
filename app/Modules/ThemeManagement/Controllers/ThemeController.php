<?php

namespace App\Modules\ThemeManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ThemeResource;
use App\Modules\ThemeManagement\Models\Theme;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function getThemes(Request $request)
    {
        $themes = Theme::with('widgets')->active()
                        ->latest()
                        ->get();

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
        $theme = Theme::with('widgets')->active()
            ->where(['id' => $id])
            ->orWhere(['slug' => $id])
            ->first();

        if (!$theme) {
            return response()->json(
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

    public function index(Request $request)
    {
        return $this->getThemes($request);
    }

    public function show(Request $request, $id)
    {
        return $this->getTheme($request, $id);
    }

    public function preview($slug)
    {
        return view("themes.preview", ["slug" => $slug]);
    }
}