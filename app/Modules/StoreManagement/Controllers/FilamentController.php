<?php

namespace App\Modules\StoreManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\StoreManagement\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Filament\Notifications\Notification;

class FilamentController extends Controller
{
    public function store(){

        $user = auth()->user();
        return view('filament.seller.pages.seller-store', compact('user'));
    }

    public function storeSwitch(Request $request){
        $request->validate([ 'store' => 'required|exists:stores,id']);

        $store = Store::findorfail($request->store);
        $user = auth()->user();

        // Store the selected store ID in the session
        Session::put('STORE_ID', $request->store);

        Notification::make()
        ->title('Store switched successfully.')
        ->body('Changes to '. $store->name)
        ->success()
        ->send();

        return redirect()->to(url('/seller'));

    }
}