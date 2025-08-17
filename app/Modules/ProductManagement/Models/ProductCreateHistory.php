<?php

namespace App\Modules\ProductManagement\Models;

use App\Modules\InventoryManagement\Models\ProductStock;
use Illuminate\Database\Eloquent\Model;

class ProductCreateHistory extends Model
{
    public $fillable = [
        "product_id",
        "product_stock_id",
        "qty",
        "price",
        "discount_amount",
        "buying_price",
        "note",
        "tax"
    ];

    protected $casts = [
        'qty' => 'float',
        'price' => 'float',
        'discount_amount' => 'float',
        'buying_price' => 'float',
        'tax' => 'float',
        'note' => 'string',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function stock(){
        return $this->belongsTo(ProductStock::class, "product_stock_id");
    }
}