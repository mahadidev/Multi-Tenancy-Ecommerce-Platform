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

    // public function sendOrderConfirmationNotifications()
    // {

    //     $seller = Store::find($this->store_id)->owner;
    //     // CHECK IF this email not found then get the email from the user
    //     $customerEmail = $this->email ?: ($this->user ? $this->user->email : null);

    //     Log::info('Customer Details: Name: ' . $this->name . ', Email: ' . $customerEmail);

    //     if ($customerEmail) {
    //         Notification::route('mail', $customerEmail)
    //             ->notify(new OrderConfirmationNotification($this, true));
    //     }

    //     // Send notification to seller
    //     if ($seller) {
    //         $seller->notify(new OrderConfirmationNotification($this, false));
    //     }
    // }

    public function sendOrderConfirmationNotifications()
{
    // Get the seller (store owner)
    $store = Store::find($this->store_id);
    $seller = $store ? $store->owner : null;

    // Determine the customer's email
    $customerEmail = $this->email ?: ($this->user ? $this->user->email : null);

    // Log details for debugging
    Log::info('Order Notification Debug:', [
        'Order ID' => $this->uuid,
        'Customer Name' => $this->name,
        'Customer Email' => $customerEmail,
        'Seller' => $seller ? $seller->email : 'None',
    ]);

    // Send notification to customer
    if ($customerEmail) {
        Notification::route('mail', $customerEmail)
            ->notify(new OrderConfirmationNotification($this, true));
    } else {
        Log::warning('Order Notification: Customer email not found.', ['Order ID' => $this->uuid]);
    }

    // Send notification to seller
    if ($seller) {
        $seller->notify(new OrderConfirmationNotification($this, false));
    } else {
        Log::warning('Order Notification: Seller not found.', ['Store ID' => $this->store_id]);
    }
}



    protected static function booted()
    {
        static::created(function ($order) {
            $order->sendOrderConfirmationNotifications();
        });
    }
}
