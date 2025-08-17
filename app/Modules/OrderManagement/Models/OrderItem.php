<?php

namespace App\Modules\OrderManagement\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\InventoryManagement\Models\ProductStock;
use App\Modules\ProductManagement\Models\Product;
use App\Modules\OrderManagement\Models\Order;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\UserManagement\Models\User;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'product_id',
        'store_id',
        'item',
        'price',
        'discount_price',
        'tax',
        'total',
        'returned',
        'qty',
        'code',
        'returned_qty',
        'is_free',
        'is_returned',
        'product_stock_id',
    ];

    protected $casts = [
        'options' => 'array',
        'price' => 'float',
        'discount_price' => 'float',
        'tax' => 'float',
        'total' => 'float',
        'qty' => 'float',
        'returned_qty' => 'float',
        'returned' => 'boolean',
        'is_free' => 'boolean',
        'is_returned' => 'boolean',
        'order_id' => 'integer',
        'user_id' => 'integer',
        'product_id' => 'integer',
        'store_id' => 'integer',
        'product_stock_id' => 'integer'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function stock()
    {
        return $this->belongsTo(ProductStock::class, "product_stock_id");
    }


}
