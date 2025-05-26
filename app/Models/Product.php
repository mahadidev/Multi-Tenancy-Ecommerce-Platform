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
        'tax'
    ];

    protected $casts = [
        'attachments' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($data) {
            // Auto-generate slug from name if it's not provided
            if (empty($data->slug)) {
                $data->slug = Str::slug($data->name);  // Generate slug from name
            }

            if (empty($data->status)) {
                $data->status = 1;
            }
        });


        static::updating(function ($data) {
            if ($data->isDirty('name')) {  // Check if the 'name' attribute has changed
                $data->slug = Str::slug($data->name);  // Update slug based on new name
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

    public function getDiscountPriceAttribute()
    {
        $price = $this->attributes['price'] ?? 0;
        $has_discount = $this->attributes['has_discount'] ?? 0;
        $discount = $this->attributes['discount_amount'] ?? 0;
        $discountTo = $this->attributes['discount_to'] ?? null;
        $discountType = $this->attributes['discount_type'] ?? null;

        if ($has_discount) {
            $currentDate = Carbon::today();
            $discountEndDate = Carbon::parse($discountTo);

            if ($currentDate->lte($discountEndDate)) {
                // Calculate the discounted price
                if ($discountType === 'percentage') {
                    $discountedPrice = $price - ($price * ($discount / 100));
                    return number_format($discountedPrice, 2, '.', '');
                } else if ($discountType === 'flat') {
                    $discountedPrice = $price - $discount;
                    return number_format($discountedPrice, 2, '.', '');
                }
            }
        }

        // If no discount or the discount date is not valid, return the original price
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
