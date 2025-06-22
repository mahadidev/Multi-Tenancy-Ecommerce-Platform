<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'product_id',
        'store_id',
        'item',
        'price',
        'discount_price',
        'tax',
        'total',
        'returned',
        'qty',
        'code',
        'returned_qty',
        'is_free',
        'is_returned',
        'options',
    ];

    protected $casts = [
        'options' => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


}
