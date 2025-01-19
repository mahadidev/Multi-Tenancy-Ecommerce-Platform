<?php
namespace App\Services;


use App\Models\WidgetGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileService
{
    public function filterUrl($url): string
    {
        if (strpos("http", $url) !== false) {
            return explode("storage", $url)[1];
        }

        return $url;
    }


}
