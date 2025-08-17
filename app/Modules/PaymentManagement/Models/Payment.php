<?php

namespace App\Modules\PaymentManagement\Models;

use App\Modules\UserManagement\Models\User;
use App\Modules\StoreManagement\Models\Store;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'store_id',
        'transaction_id',
        'invoice_id',
        'name',
        'email',
        'phone',
        'amount',
        'status',
        'currency',
        'payment_method',
        'payable_id', // Morphable relation ID
        'payable_type', // Morphable relation Model Type
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function store(){
        return $this->belongsTo(Store::class, 'store_id');
    }

    public function payable()
    {
        return $this->morphTo();
    }
}