<?php

namespace App\Modules\WebsiteBuilder\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WebsiteForm extends Model
{
    protected $fillable = [
        'website_id',
        'name',
        'type',
        'fields',
        'settings',
        'is_active',
    ];

    protected $casts = [
        'fields' => 'json',
        'settings' => 'json',
        'is_active' => 'boolean',
    ];

    public function website(): BelongsTo
    {
        return $this->belongsTo(StoreWebsite::class, 'website_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class, 'form_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function getUnreadSubmissionsCountAttribute(): int
    {
        return $this->submissions()->where('is_read', false)->count();
    }

    public function getTotalSubmissionsCountAttribute(): int
    {
        return $this->submissions()->count();
    }
}