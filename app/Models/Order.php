<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

}
