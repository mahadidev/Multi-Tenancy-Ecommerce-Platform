<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StorePage extends Model
{
    protected $fillable = [
        'name',
        'type',
        'slug',
        'title',
        'store_id',
        'is_active'
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    public function widgets()
    {
        return $this->hasMany(StorePageWidget::class, 'store_page_id');
    }

    public function scopeAuthorized($query)
    {
        return $query->where('store_id', authStore());
    }

}
