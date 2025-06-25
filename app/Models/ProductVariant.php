<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductVariant extends Model
{
    protected static function boot()
    {
        parent::boot();

        // Automatically generate a slug when creating
        static::creating(function ($data) {
            if (empty($data->slug)) {
                $data->slug = Str::slug($data->label);  // Generate slug from name
            }

        });

        // Automatically update the slug when updating
        static::updating(function ($data) {
            if ($data->isDirty('label')) {  // Check if the 'label' attribute has changed
                $data->slug = Str::slug($data->label);  // Update slug based on new label
            }
        });
    }

    protected $fillable = [
        'product_id', // The product to which this variant belongs
        'label',      // Variant label, e.g., "Color", "Size"
        // 'options',    // JSON data for variant options (nested structure)
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        // 'options' => 'array',
        'label' => 'string'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function options(){
        return $this->hasMany(ProductVariantOption::class, 'variant_id');
    }
}
