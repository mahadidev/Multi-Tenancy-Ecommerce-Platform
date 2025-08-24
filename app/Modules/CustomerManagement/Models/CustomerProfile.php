<?php

namespace App\Modules\CustomerManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;
use App\Modules\UserManagement\Models\User;
use App\Modules\StoreManagement\Models\Store;

class CustomerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'store_id', 
        'display_name',
        'phone',
        'address',
        'password',
        'password_changed_at',
        'notes',
        'custom_fields',
        'status',
        'total_spent',
        'total_orders',
        'last_order_at',
    ];

    protected $hidden = [
        'password', // Hide password from JSON responses
    ];

    protected $casts = [
        'custom_fields' => 'array',
        'total_spent' => 'decimal:2',
        'password_changed_at' => 'datetime',
        'last_order_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    // Accessors for effective values (store-specific or fallback to user)
    public function getEffectiveNameAttribute(): string
    {
        return $this->display_name ?: $this->user->name;
    }

    public function getEffectivePhoneAttribute(): ?string
    {
        return $this->phone ?: $this->user->phone;
    }

    public function getEffectiveAddressAttribute(): ?string
    {
        return $this->address ?: $this->user->address;
    }

    public function getEffectiveEmailAttribute(): string
    {
        return $this->user->email; // Email is always from user table
    }

    // Password methods
    public function hasStorePassword(): bool
    {
        return !empty($this->password);
    }

    public function getEffectivePasswordAttribute(): string
    {
        return $this->password ?: $this->user->password;
    }

    public function setStorePassword(string $password): void
    {
        $this->update([
            'password' => Hash::make($password),
            'password_changed_at' => now(),
        ]);
    }

    public function checkPassword(string $password): bool
    {
        return Hash::check($password, $this->effective_password);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForStore($query, int $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    // Helper methods
    public function updateMetrics(float $orderAmount = 0): void
    {
        $this->increment('total_orders');
        $this->increment('total_spent', $orderAmount);
        $this->update(['last_order_at' => now()]);
    }

    public function isBlocked(): bool
    {
        return $this->status === 'blocked';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}