<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'name',
        'title',
        'price_monthly',
        'is_trend'
    ];

    public function features()
    {
        return $this->hasMany(SubscriptionFeature::class);
    }
}
