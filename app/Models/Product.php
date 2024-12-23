<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

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
    
   
}
