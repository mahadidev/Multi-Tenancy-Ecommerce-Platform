<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Filament\Notifications\Notification;

class ThemeController extends Controller
{
    public function show($slug)
    {
        return view("themes.preview", ["slug" => $slug]);
    }
}
