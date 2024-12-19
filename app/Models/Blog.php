<?php

namespace App\Models;

use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'image',
        'content',
        'status',

    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            // Set the authenticated user's ID when a new blog is being created
            if (Auth::check()) {
                $blog->user_id = Auth::id();
            }

            // Auto-generate slug from title if it's not provided
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);  // Generate slug from title
            }
            
        });
    }
    
}
