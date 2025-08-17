<?php

namespace App\Modules\AnalyticsManagement\Models;

use App\Modules\StoreManagement\Models\Store;
use Illuminate\Database\Eloquent\Model;

class StoreVisitor extends Model
{
    protected $fillable = [
        'visited_at',
        'user_agent',
        'ip_address',
        'store_id'
    ];

    public function store(){
        return $this->belongsTo(Store::class, 'store_id');
    }
}