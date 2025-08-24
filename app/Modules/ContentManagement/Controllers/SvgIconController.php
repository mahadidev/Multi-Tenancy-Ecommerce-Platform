<?php

namespace App\Modules\ContentManagement\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\ContentManagement\Models\SvgIcon;
use App\Modules\ContentManagement\Resources\SvgIconResource;

class SvgIconController extends Controller
{
    public function index(Request $request)
    {
        $svgIcons = SvgIcon::latest()->get();

        return response()->json([
            'status' => 200,
            'data' => [
                "svgIcons" => SvgIconResource::collection($svgIcons)
            ],
        ], 200);
    }
}