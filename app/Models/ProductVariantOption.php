<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariantOption extends Model
{
    protected $fillable = [
       'label', 'slug', 'variant_id'
    ];

    public function types(){
        return $this->hasMany(ProductVariantOptionType::class, 'option_id');
    }

    public function variant(){
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
