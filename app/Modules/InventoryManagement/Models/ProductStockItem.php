<?php

namespace App\Modules\InventoryManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\ProductManagement\Models\ProductVariantOption;

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
