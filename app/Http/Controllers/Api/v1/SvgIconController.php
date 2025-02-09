<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SvgIcon;
use App\Http\Resources\SvgIconResource;

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
