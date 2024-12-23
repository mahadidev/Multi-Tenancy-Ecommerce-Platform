<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class ArtisanController extends Controller
{
    public function run()
    {
        try {
            Artisan::call('db:seed');
            Artisan::call('filament:optimize-clear');
            Artisan::call('filament:optimize');
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        // Return a response to the user
        return response()->json(['message' => 'Deployment commands executed successfully!']);
    }
}
