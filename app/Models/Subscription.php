<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subscription extends Model
{
    protected $fillable = [
        'name',
        'title',
        'price_monthly',
        'is_trend',
        'is_visible'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($subscription) {
            $subscription->name = Str::slug($subscription->name);
        });

        static::updating(function ($subscription) {
            if ($subscription->isDirty('name')) {
                $subscription->name = Str::slug($subscription->name);
            }
        });
    }

    public function features()
    {
        return $this->hasMany(SubscriptionFeature::class);
    }

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }
}
