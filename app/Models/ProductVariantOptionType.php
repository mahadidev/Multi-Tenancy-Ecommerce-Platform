<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariantOptionType extends Model
{
    protected $fillable = [
        'option_id',
        'label',
        'code',
        'price',
        'qty_stock',
    ];

    public function option(){
        return $this->belongsTo(ProductVariantOption::class, 'option_id');
    }
}
