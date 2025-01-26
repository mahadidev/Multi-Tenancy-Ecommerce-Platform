<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Filament\Panel;
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Laravel\Sanctum\HasApiTokens;
use PDO;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable implements FilamentUser, MustVerifyEmail, HasAvatar
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

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
        'email_verified_at',
        'store_id',
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
        if (auth()->check() && (auth()->user()->hasRole('super-admin') || auth()->user()->hasRole('admin')) && $panel->getId() === 'admin') {
            return true;
        }
        return false;
    }


    public function stores()
    {
        return $this->hasMany(Store::class, 'owner_id');
    }

    public function isAdmin()
    {

        if (auth()->user()->hasRole('admin') || auth()->user()->hasRole('super-admin')) {
            return true;
        }

        return false;
    }

    public function storeSession()
    {
        return $this->hasOne(StoreSession::class, 'user_id');
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
    
}
