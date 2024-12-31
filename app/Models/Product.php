<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{

    protected $fillable = [
        'store_id',
        'category_id',
        'name',
        'slug',
        'sku',
        'description',
        'thumbnail',
        'cost_price',
        'price',
        'stock',
        'has_variants',
        'has_in_stocks',
        'status',
        'attachments'
    ];

    protected $casts = [
        'attachments' => 'array',
    ]; 
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($data) {
            // Auto-generate slug from name if it's not provided
            if (empty($data->slug)) {
                $data->slug = Str::slug($data->name);  // Generate slug from name
            }

            if (empty($data->status)) {
                $data->status = 'active';
            }
            
        });
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class)->where('type', 'product');
    }
    
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function scopeAuthorized($query){
        return $query->where('store_id', authStore());
    }

    public function scopeActive($query){
        return $query->where('status', 1);
    }

    // Accessor for the thumbnail
    public function getThumbnailImageAttribute()
    {
        return $this->thumbnail ? url(Storage::url($this->thumbnail)) : null;
    }

    // Accessor for the attachments
    public function getAttachmentsImageAttribute()
    {
        $attachments = $this->attachments; // Assuming attachments is already cast to an array

        if (is_array($attachments)) {
            return array_map(fn($path) => url(Storage::url($path)), $attachments);
        }

        return [];
    }
}
