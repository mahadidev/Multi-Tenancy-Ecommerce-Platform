<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class Store extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = ['store_type_id','owner_id', 'name', 'slug', 'domain', 'email', 'phone', 'location', 'status', 'currency', 'logo', 'dark_logo', 'settings', 'theme_id', 'primary_color', 'secondary_color', 'description'];
    protected $casts = [
        'settings' => 'json',
        // 'settings' => 'array',
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
        $domain = 'https://' . parse_url(env('APP_URL'), PHP_URL_HOST) . '/sites/' . $this->domain;

        return $domain;
    }

    // Scope to check ownership
    public function scopeStoreOwner($query)
    {
        return $query->where('owner_id', auth()->id());
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

    public function socialMedia()
    {
        return $this->hasMany(StoreSocialMedia::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function brands(){
        return $this->hasMany(Brand::class);
    }

    public function categories(){
        return $this->hasMany(Category::class);
    }

    public function menus()
    {
        return $this->hasMany(StoreMenu::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function featured_products()
    {
        return $this->hasMany(Product::class)->take(5);
    }

    public function uniqueVisitorsToday()
    {
        return DB::table('store_visitors')
            ->where('store_id', $this->id)
            ->whereDate('visited_at', now()->toDateString())
            ->distinct('ip_address')
            ->count();
    }

    public function visitors()
    {
        return DB::table('store_visitors')
            ->where('store_id', $this->id)
            ->count();
    }

    public function uniqueVisitors()
    {
        return DB::table('store_visitors')
            ->where('store_id', $this->id)
            ->distinct('ip_address')
            ->count();
    }

    public function widgets(){
        return $this->hasMany(StoreWidget::class, 'store_id');
    }

    public function storeType()
    {
        return $this->belongsTo(StoreType::class, 'store_type_id');
    }
}
