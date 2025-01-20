<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Theme extends Model
{

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

    protected $hidden  = [
        'created_at',
        'updated_at',
    ];
    
    protected $fillable = [
        'name',
        'slug',
        'thumbnail',
        'is_active',
        'has_widgets'
    ];

    public function pages()
    {
        return $this->hasMany(ThemePage::class);
    }

    public function getThumbnailImageAttribute()
    {
        return $this->thumbnail ? url(Storage::url($this->thumbnail)) : null;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

}
