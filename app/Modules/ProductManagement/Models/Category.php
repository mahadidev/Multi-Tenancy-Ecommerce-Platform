<?php

namespace App\Modules\ProductManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = 
    [
        'name',
        'slug',
        'type',
        'parent_id',
        'store_id',
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

            if (empty($category->type)) {
                $category->type = "product";  // Corrected to use $category->name
            }
        });

        // Automatically update the slug when updating
        static::updating(function ($category) {
            if ($category->isDirty('name')) {  // Check if the 'name' attribute has changed
                $category->slug = Str::slug($category->name);  // Update slug based on new name
            }
        });
    }


    public function blog()
    {
        return $this->hasMany(Blog::class, 'category_id');
    }

    public function product()
    {
        return $this->hasMany(Product::class, 'category_id');
    }

    public function parent(){
        return $this->belongsTo(Category::class, 'parent_id');
    }
    
    public function has_parent(){
        return $this->belongsTo(Category::class, 'parent_id');
    }
    
    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    // public function author(){
    //     return $this->belongsTo(User::class, 'user_id');
    // }

    public function scopeAuthorized($query){
        return $query->where('store_id', authStore());
    }

    
}








