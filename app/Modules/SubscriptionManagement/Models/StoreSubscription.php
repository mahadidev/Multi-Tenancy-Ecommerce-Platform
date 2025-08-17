<?php

namespace App\Modules\SubscriptionManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\UserManagement\Models\User;
use App\Modules\StoreManagement\Models\Store;
use App\Models\Subscription;

class StoreSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'store_id',
        'subscription_id',
        'start_date',
        'end_date',
        'is_active',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function store(){
        return $this->belongsTo(Store::class, 'store_id');
    }

    public function package(){
        return $this->belongsTo(Subscription::class, 'subscription_id');
    }
}
