<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    protected $fillable = ['email', 'status', 'store_id'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
