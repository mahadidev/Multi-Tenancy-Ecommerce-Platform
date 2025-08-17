<?php

namespace App\Modules\StoreManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\StoreManagement\Models\Store;

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

    public function scopeAuthorized($query){
        return $query->where('store_id', authStore());
    }
}
