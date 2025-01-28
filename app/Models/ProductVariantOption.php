<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariantOption extends Model
{
    protected $fillable = [
        'variant_id',
        'label',
        'slug',
        'code',
        'price',
        'qty_stock',
    ];

    public function variant(){
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
