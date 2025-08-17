<?php

namespace App\Modules\InventoryManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\ProductManagement\Models\Product;

class ProductStock extends Model
{
    protected $fillable = ["product_id", "price", "buying_price", "qty", "sku", 'discount_amount', 'tax', 'note'];

    protected $casts = [
        'price' => 'float',
        'buying_price' => 'float',
        'discount_amount' => 'float',
        'tax' => 'float',
        'qty' => 'float',
        'sku' => 'string',
        'note' => 'string'
    ];

    public function items(){
        return $this->hasMany(ProductStockItem::class, "stock_id");
    }

    public function product(){
        return $this->belongsTo(Product::class, "product_id");
    }

    public function History(){
        return $this->hasMany(ProductCreateHistory::class, "product_stock_id");
    }

    public function orders()
    {
        return $this->hasMany(ProductCreateHistory::class, "product_stock_id");
    }
}
