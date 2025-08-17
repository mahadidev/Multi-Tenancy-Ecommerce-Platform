<?php

namespace App\Modules\InventoryManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\ProductManagement\Models\Product;
use App\Modules\InventoryManagement\Models\ProductStock;

class ProductStockHistory extends Model
{
    public $fillable = [
        "product_id",
        "product_stock_id",
        "qty",
        "price",
        "discount_amount",
        "buying_price",
        "note",
        "tax",
        "type"
    ];

    protected $casts = [
        'qty' => 'float',
        'price' => 'float',
        'discount_amount' => 'float',
        'buying_price' => 'float',
        'tax' => 'float',
        'note' => 'string',
        'type' => 'string'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function stock(){
        return $this->belongsTo(ProductStock::class, "product_stock_id");
    }
}
