<?php

namespace App\Modules\StoreManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\StoreManagement\Models\StoreMenuItem;

class StoreMenu extends Model
{
    protected $fillable = [
        'store_id',
        'label',
        'name',
        'visibility',
    ];

    public function scopeAuthorized($query)
    {
        return $query->where('store_id', authStore());
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    // Relationship with StoreMenuItems
    public function items()
    {
        return $this->hasMany(StoreMenuItem::class);
    }
}
