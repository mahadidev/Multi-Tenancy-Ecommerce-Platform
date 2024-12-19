<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = 
    [
        'name',
        'slug',
        'type',
    ];



    // Boot method to auto-generate slug before saving
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($category) {
            // Auto-generate slug from name
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);  // Corrected to use $category->name
            }
        });
    }


    public function blog()
    {
        return $this->hasMany(Blog::class, 'category_id');
    }
}








