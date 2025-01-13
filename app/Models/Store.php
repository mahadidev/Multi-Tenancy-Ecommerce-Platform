<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Store extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = ['owner_id', 'name', 'slug', 'domain', 'email', 'phone', 'location', 'status', 'currency', 'logo', 'dark_logo', 'settings', 'theme_id', 'primary_color', 'secondary_color', 'type', 'description'];
    protected $casts = [
        'settings' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        // Automatically generate a slug when creating
        static::creating(function ($data) {
            if (empty($data->slug)) {
                $data->slug = Str::slug($data->name); // Generate slug from name
            }
        });

        // Automatically update the slug when updating
        static::updating(function ($data) {
            if ($data->isDirty('name')) {
                // Check if the 'name' attribute has changed
                $data->slug = Str::slug($data->name); // Update slug based on new name
            }
        });
    }

    public function getLogoImageAttribute()
    {
        return $this->logo ? url(Storage::url($this->logo)) : null;
    }

    public function getDarkLogoImageAttribute()
    {
        return $this->dark_logo ? url(Storage::url($this->dark_logo)) : null;
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function domain()
    {
        // $domain = 'https://' . $this->domain . '.' . parse_url(env('APP_URL'), PHP_URL_HOST) . '.com';
        $domain = 'https://' . parse_url(env('APP_URL'), PHP_URL_HOST) . '.com' . '/stores/' . $this->domain;

        return $domain;
    }

    // Scope to check ownership
    public function scopeStoreOwner($query)
    {
        return $query->where('owner_id', auth()->user()->id);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function storeSessions()
    {
        return $this->hasMany(StoreSession::class);
    }

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }

    public function pages(){
        return $this->hasMany(StorePage::class, 'store_id');
    }
}
