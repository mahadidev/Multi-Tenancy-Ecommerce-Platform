<?php

namespace App\Models;

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
        'payment_method'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
