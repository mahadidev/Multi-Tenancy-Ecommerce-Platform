<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    protected static function boot()
    {
        parent::boot();

        // before the model is saved while editing delete the old file
        // static::updating(function ($fileStorage) {
        //     $original = $fileStorage->getOriginal();
        //     if ($fileStorage->location !== $original['location']) {
        //         Storage::disk('public')->delete($original['location']);
        //     }

            
        // });

        // Before the model is deleted
        static::deleting(function ($fileStorage) {
            if ($fileStorage->location) {
                Storage::disk('public')->delete($fileStorage->location);
            }
        });
    }
    
}
