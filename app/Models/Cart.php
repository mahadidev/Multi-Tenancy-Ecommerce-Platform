<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'store_id',
        'user_id',
        'product_id',
        'session_id',
        'item',
        'price',
        'discount',
        'vat',
        'qty',
        'total',
        'note',
        'options',
        'is_active',
    ];
    
    
    public function product(){
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
