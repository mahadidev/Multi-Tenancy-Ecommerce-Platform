<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductStockItem extends Model
{
    protected $fillable = ["stock_id",
    "variant_opton_id"];

    public function stock(){
        return $this->belongsTo(ProductStock::class, "stock_id");
    }

    public function variantOption(){
        return $this->belongsTo(ProductVariantOption::class, "variant_opton_id");
    }
}
