<?php

namespace App\Http\Controllers\Api\v1\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function profile(Request $request){
        return $user = auth()->user();
    }
}
