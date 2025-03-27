<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreApiCredential extends Model
{
    protected $fillable = ['store_id', 'provider', 'credentials', 'status'];

    protected $casts = [
        'credentials' => 'array'
    ];

    protected $encryptable = ['credentials']; // Encrypt API credentials

    public function store()
    {
        return $this->belongsTo(Store::class);
    }


}
