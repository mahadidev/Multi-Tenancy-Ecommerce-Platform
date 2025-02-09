<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreMenu extends Model
{
    protected $fillable = [
        'store_id',
        'label',
        'name',
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
