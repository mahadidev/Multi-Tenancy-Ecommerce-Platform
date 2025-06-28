<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariantStockItem extends Model
{

    public $fillable = [
        "variant_stock_id",
        "variant_option_id"
    ];

    public function variantStock()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_stock_id');
    }

    public function VariantOption()
    {
        return $this->belongsTo(ProductVariantOption::class, "variant_option_id");
    }
}
