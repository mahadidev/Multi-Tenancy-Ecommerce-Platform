<?php

namespace App\Modules\UserManagement\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Modules\RoleManagement\Traits\HasCustomRoles;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Filament\Panel;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;
use App\Modules\NotificationManagement\Models\Notification;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\StoreManagement\Models\StoreSession;
use App\Modules\OrderManagement\Models\Cart;
use App\Modules\OrderManagement\Models\Order;
use App\Modules\PaymentManagement\Models\Payment;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable implements FilamentUser, MustVerifyEmail, HasAvatar
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasCustomRoles, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'image',
        'address',
        'password',
        'verification_code',
        'email_verified_at',
        'store_id',
        'remember_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'store_id' => 'array'
        ];
    }

    // public function getStoresAttribute()
    // {
    //     return Store::whereIn('id', $this->store_id ?? [])
    //         ->whereNull('deleted_at')
    //         ->get();
    // }

    public function getUserImageAttribute()
    {
        return $this->image ? url(Storage::url($this->image)) : null;
    }

    public function getProfilePhotoUrlAttribute()
    {
    }
    
    public function getFilamentAvatarUrl(): ?string
    {
        return $this->image;
    }

    public function canAccessPanel(Panel $panel): bool
    {
        if (auth()->check() && $this->canAccessAdminPanel() && $panel->getId() === 'admin') {
            return true;
        }
        return false;
    }

    public function scopeStoreRegistered($query)
    {
        return $query->whereJsonContains('store_id', authStore());
    }

    // === Relationship Methods ===

    /**
     * Get the user's store session
     */
    public function storeSession(): HasOne
    {
        return $this->hasOne(StoreSession::class);
    }

    /**
     * Get stores owned by this user
     */
    public function ownedStores(): HasMany
    {
        return $this->hasMany(Store::class, 'owner_id');
    }

    /**
     * Get stores this user is associated with
     */
    public function associatedStores(): BelongsToMany
    {
        return $this->belongsToMany(Store::class, 'store_users', 'user_id', 'store_id');
    }

    public function stores()
    {
        return $this->hasMany(Store::class, 'owner_id');
    }

    public function cartItems()
    {
        return $this->hasMany(Cart::class, 'user_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable')->orderBy('created_at', 'desc');
    }

    public function payments(){
        return $this->hasMany(Payment::class, 'user_id');
    }

    public function expenses()
    {
        return $this->hasMany(\App\Modules\FinancialManagement\Models\Expense::class, 'user_id');
    }

    // === Business Logic Methods ===

    /**
     * Check if user has access to a specific store
     */
    public function hasStoreAccess(int $storeId): bool
    {
        // Check if user owns the store
        if ($this->ownedStores()->where('id', $storeId)->exists()) {
            return true;
        }

        // Check if user is associated with the store
        if ($this->associatedStores()->where('store_id', $storeId)->exists()) {
            return true;
        }

        // Check if store_id is in the user's store_id JSON field
        if (is_array($this->store_id) && in_array($storeId, $this->store_id)) {
            return true;
        }

        return false;
    }

    /**
     * Get user's primary store
     */
    public function getPrimaryStore(): ?Store
    {
        // First try to get from store session
        $storeSession = $this->storeSession;
        if ($storeSession) {
            return Store::find($storeSession->store_id);
        }

        // Then try owned stores
        return $this->ownedStores()->first();
    }

    /**
     * Check if user is verified
     */
    public function isVerified(): bool
    {
        return $this->email_verified_at !== null;
    }

}