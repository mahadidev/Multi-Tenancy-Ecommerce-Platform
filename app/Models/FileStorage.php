<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileStorage extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'location',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}
