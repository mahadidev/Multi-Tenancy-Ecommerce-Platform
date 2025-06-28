<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariantStock extends Model
{
    public $fillable = [
        "product_id",
        'variant_id',
        "price",
        "qty",
        "sku"
    ];

    protected $casts = [
        "price" => "float",
        "qty" => 'float',
        'sku' => "string"
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, "product_id");
    }

    public function items()
    {
        return $this->hasMany(ProductVariantStockItem::class, 'variant_stock_id');
    }
}
