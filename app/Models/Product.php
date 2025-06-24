<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
class Product extends Model
{
    protected $fillable = [
        'store_id',
        'category_id',
        'brand_id',
        'name',
        'slug',
        'sku',
        'short_description',
        'description',
        'thumbnail',
        'cost_price',
        'price',
        'buying_price',
        'stock',
        'has_variants',
        'has_in_stocks',
        'status',
        'attachments',
        'is_trending',
        'is_featured',
        'has_discount',
        'discount_to',
        'discount_type',
        'discount_amount',
        'tax',
    ];

    protected $casts = [
        'attachments' => 'array',
        'cost_price' => 'float',
        'price' => 'float',
        'buying_price' => 'float',
        'stock' => 'float',
        'discount_amount' => 'float',
        'tax' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }

            if (empty($product->status)) {
                $product->status = 1;
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name')) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class)->where('type', 'product');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function scopeAuthorized($query)
    {
        return $query->where('store_id', authStore());
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function getThumbnailImageAttribute()
    {
        return $this->thumbnail ? url(Storage::url($this->thumbnail)) : null;
    }

    public function getAttachmentsImageAttribute()
    {
        $attachments = $this->attachments;

        if (is_array($attachments)) {
            return array_map(fn($path) => url(Storage::url($path)), $attachments);
        }

        return [];
    }

    // The following functions will be used in the frontend sections

    public function calculateDiscountPrice()
    {
        $price = $this->price ?? 0;
        $hasDiscount = $this->has_discount;
        $discount = $this->discount_amount ?? 0;
        $discountTo = $this->discount_to;
        $discountType = $this->discount_type;

        if ($hasDiscount && $discountTo && Carbon::today()->lte(Carbon::parse($discountTo))) {
            if ($discountType === 'percentage') {
                return round($price - ($price * ($discount / 100)), 2);
            } elseif ($discountType === 'flat') {
                return round($price - $discount, 2);
            }
        }

        return $price;
    }

    public function priceTag()
    {
        $price = number_format(self::getDiscountPriceAttribute(), 2);

        $currency = getStore()->currency;

        $priceTag = $currency . ' ' . $price;

        return $priceTag;
    }

    public function originalPrice()
    {

        $price = number_format($this->attributes['price'], 2);
        $currency = getStore()->currency;

        $productPrice = $currency . ' ' . $price;

        return $productPrice;
    }

    public function checkDiscountValidity()
    {
        $discountTo = $this->attributes['discount_to'];

        if ($discountTo) {
            $currentDate = Carbon::today();
            $discountEndDate = Carbon::parse($discountTo);

            if ($currentDate->lte($discountEndDate)) {
                return 1;
            }
        }

        return 0;
    }
}
