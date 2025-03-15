<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
