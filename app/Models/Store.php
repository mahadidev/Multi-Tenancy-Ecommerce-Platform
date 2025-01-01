<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;


class Store extends Model
{
    use SoftDeletes,HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'domain',
        'email',
        'phone',
        'location',
        'status',
        'currency',
        'logo'
    ];

    protected static function boot()
    {
        parent::boot();

        // Automatically generate a slug when creating
        static::creating(function ($data) {
            if (empty($data->slug)) {
                $data->slug = Str::slug($data->name);  // Generate slug from name
            }
            
        });

        // Automatically update the slug when updating
        static::updating(function ($data) {
            if ($data->isDirty('name')) {  // Check if the 'name' attribute has changed
                $data->slug = Str::slug($data->name);  // Update slug based on new name
            }
        });
    }

     // Accessor for the logo
     public function getLogoImageAttribute()
     {
         return $this->logo ? url(Storage::url($this->logo)) : null;
     }

    public function owner(){
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function domain(){
        $domain = 'https://'.$this->domain.'.'.parse_url(env('APP_URL'), PHP_URL_HOST).'.com';

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
    
}
