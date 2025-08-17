<?php

namespace App\Modules\OrderManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Notifications\OrderConfirmationNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use App\Modules\UserManagement\Models\User;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\OrderManagement\Models\OrderItem;
use App\Modules\StoreManagement\Models\StoreShipment;

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
        'is_shipped'
    ];

    protected $casts = [
        'total' => 'float',
        'discount' => 'float',
        'vat' => 'float',
        'return_total' => 'float',
        'is_payed' => 'boolean'
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

    public function productQty()
    {
        return $this->items()->sum('qty');
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
            if (env('APP_ENV') == 'production' || env('APP_ENV') == 'local') {
                // Retrieve the store with proper error handling
                $store = Store::select('id', 'logo', 'name', 'phone', 'domain', 'location', 'email', 'currency', 'owner_id')
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
                    try {
                        $customer->notify(new OrderConfirmationNotification($this, $store, true));
                    } catch (\Exception $e) {
                        Log::error('Failed to send order confirmation notification: ' . $e->getMessage());
                    }

                }

                // Notify seller
                $seller = $store->owner;
                // log::info('seller: ' . $seller);
                if ($seller) {
                    try {
                        $seller->notify(new OrderConfirmationNotification($this, $store, false));
                    } catch (\Exception $e) {
                        Log::error('Failed to send order confirmation notification: ' . $e->getMessage());
                    }
                }
            } else {
                Log::info('Order notification disabled in local, change APP_ENV to production to enable');
            }
        } catch (\Exception $e) {
            Log::error('Order notification failed: ' . $e->getMessage());
            return response()->json(['status'=> 500,'message' => 'Order notification failed'], 500);
        }
    }

    public function shipment()
    {
        return $this->hasOne(StoreShipment::class, 'order_id');
    }
}
