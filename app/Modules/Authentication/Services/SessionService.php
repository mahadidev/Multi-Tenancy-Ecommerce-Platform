<?php

namespace App\Modules\Authentication\Services;

use App\Models\User;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\StoreManagement\Models\StoreSession;
use Illuminate\Http\Request;

class SessionService
{
    public function handleStoreSession(User $user, Request $request): void
    {
        $storeSession = $user->storeSession()->first();
        $store = null;

        if ($storeSession) {
            if ($request->hasSession()) {
                $request->session()->forget('store_id');
            }
            if (session()->isStarted() && session()->has('store_id')) {
                session()->forget('store_id');
            }

            if (session()->isStarted()) {
                session(['store_id' => $storeSession->store_id]);
            }
            $request->attributes->set('store_id', $storeSession->store_id);
            $store = Store::find($storeSession->store_id);
        }

        if (!$storeSession) {
            $store = Store::where('owner_id', $user->id)->first();

            if ($store) {
                StoreSession::updateOrCreate(
                    ['user_id' => $user->id],
                    ['store_id' => $store->id]
                );

                if ($request->hasSession()) {
                    $request->session()->forget('store_id');
                }
                if (session()->isStarted() && session()->has('store_id')) {
                    session()->forget('store_id');
                }

                if (session()->isStarted()) {
                    session(['store_id' => $store->id]);
                }
                $request->attributes->set('store_id', $store->id);
            }
        }
    }

    public function storeSessionData(Request $request, int $storeId): void
    {
        if (session()->isStarted() && session()->has('site_store_id')) {
            session()->forget('site_store_id');
        }

        if (session()->isStarted()) {
            session(['site_store_id' => $storeId]);
        }
        $request->attributes->set('site_store_id', $storeId);
    }

    public function clearSession(): void
    {
        if (session()->isStarted()) {
            session()->flush();
        }
    }
}