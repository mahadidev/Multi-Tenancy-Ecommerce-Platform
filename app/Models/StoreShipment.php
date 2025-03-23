<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreShipment extends Model
{
    protected $fillable = [
        'invoice',
        'recipient_name',
        'recipient_phone',
        'recipient_address',
        'cod_amount',
        'note',
        'consignment_id',
        'tracking_code',
        'status',
        'order_id',
        'store_id',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }
}
