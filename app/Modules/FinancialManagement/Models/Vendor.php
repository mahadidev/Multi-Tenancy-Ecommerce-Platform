<?php

namespace App\Modules\FinancialManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Modules\StoreManagement\Models\Store;

class Vendor extends Model
{
    protected $fillable = [
        'store_id',
        'name',
        'phone',
        'email',
        'address',
        'description',
        'contact_person',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'created_at_human',
        'updated_at_human',
    ];

    /**
     * Get the store that owns the vendor
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the expenses for the vendor
     */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /**
     * Get human readable created at date
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return $this->created_at ? $this->created_at->diffForHumans() : '';
    }

    /**
     * Get human readable updated at date
     */
    public function getUpdatedAtHumanAttribute(): string
    {
        return $this->updated_at ? $this->updated_at->diffForHumans() : '';
    }

    /**
     * Scope a query to only include vendors for a specific store
     */
    public function scopeForStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }
}