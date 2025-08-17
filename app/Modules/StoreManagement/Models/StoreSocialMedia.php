<?php

namespace App\Modules\StoreManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\StoreManagement\Models\Store;

class StoreSocialMedia extends Model
{
    protected $fillable = [
        'store_id',
        'name',
        'username',
        'url',
        'label',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function scopeauthoriedStore($query)
    {
        return $query->where('store_id', authStore());
    }
}
