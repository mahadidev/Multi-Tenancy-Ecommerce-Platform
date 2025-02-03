<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Notifications\OrderConfirmationNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class Order extends Model
{
    protected $fillable = [
        'uuid',
        'type',
        'source',
        'user_id',
        'store_id',
        'name',
        'phone',
        'email',
        'address',
        'total',
        'discount',
        'vat',
        'status',
        'is_approved',
        'is_closed',
        'notes',
        'has_returns',
        'return_total',
        'reason',
        'is_payed',
        'payment_method',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeCurrentStore($query)
    {
        return $query->where('store_id', session()->get('site_store_id'));
    }

    public function scopeAuthorized($query)
    {
        return $query->where('store_id', authStore());
    }

    public function sendOrderConfirmationNotifications()
    {
        try {
            if (env('APP_ENV') == 'production') {
                // Retrieve the store with proper error handling
                $store = Store::select('id', 'logo', 'name', 'phone', 'domain', 'location', 'email', 'currency')
                    ->find($this->store_id);

                if (!$store) {
                    Log::error('Store not found for order: ' . $this->uuid);
                    // return;
                }

                $d = 'https://' . parse_url(env('APP_URL'), PHP_URL_HOST) . '/sites/' . $store->domain;
                $store->setAttribute('computed_domain', $d);

                // Log::info('store: ' . $store);

                // For customer notification
                $customer = User::find($this->user_id);
                if ($customer) {
                    $customer->notify(new OrderConfirmationNotification($this, $store, true));
                }

                // Notify seller
                $seller = $store->owner;
                if ($seller) {
                    $seller->notify(new OrderConfirmationNotification($this, $store, false));
                }
            } else {
                Log::info('Order notification disabled in local, change APP_ENV to production to enable');
            }
        } catch (\Exception $e) {
            Log::error('Order notification failed: ' . $e->getMessage());
            return response()->json(['status'=> 500,'message' => 'Order notification failed'], 500);
        }
    }
}
