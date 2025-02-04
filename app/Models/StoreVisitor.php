<?php

namespace App\Models;

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
