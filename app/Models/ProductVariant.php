<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{

    protected $fillable = [
        'product_id',
        'name',
        'sku',
        'color',
        'size',
        'cost_price',
        'price',
        'stock',
    ];
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
}
