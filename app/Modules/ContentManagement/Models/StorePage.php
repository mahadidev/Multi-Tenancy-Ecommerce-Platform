<?php

namespace App\Modules\ContentManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\ContentManagement\Models\Widget;

class StorePage extends Model
{
    protected $fillable = [
        'name',
        'type',
        'slug',
        'title',
        'layout_id',
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
        return $this->morphMany(Widget::class, 'ref');
    }
    
    public function scopeAuthorized($query)
    {
        return $query->where('store_id', authStore());
    }

    public function layout()
    {
        return $this->belongsTo(Widget::class, 'layout_id');
    }
}
