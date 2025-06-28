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

    protected $casts = [
        'qty_stock' => 'float',
        'price' => 'float',
        'label' => 'string',
        'slug' => 'string',
        'code' => 'string'
    ];

    public function variant(){
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function Stocks(){
        return $this->hasMany(ProductVariantStockItem::class, 'variant_option_id');
    }
}
