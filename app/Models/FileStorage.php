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
        'response_type',
        'width',
        'height',
        'alternate_text',
        'tags',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            // Set user_id if not provided
            if (empty($model->user_id)) {
                $model->user_id = auth()->id();
            }

            // Handle file upload for both new and updated files
            if (!empty($model->location) && 
                (!$model->exists || $model->isDirty('location'))) {
                
                // Delete old file if this is an update
                if ($model->exists && $model->getOriginal('location')) {
                    Storage::disk('public')->delete($model->getOriginal('location'));
                }

                $uniqueName = uniqid() . '_' . time();
                $extension = pathinfo($model->location, PATHINFO_EXTENSION);
                $newFileName = $uniqueName . '.' . $extension;

                // Rename the file in storage
                $storage = Storage::disk('public');
                $oldPath = $model->location;
                $newPath = 'file_storage/' . $newFileName;

                if ($storage->exists($oldPath)) {
                    $storage->move($oldPath, $newPath);
                }

                // Update model attributes
                $model->location = $newPath;
                $model->name = $newFileName;
                $model->type = strtolower($extension) === 'pdf' ? 'pdf' : 'image';
            }
        });

        // Before the model is deleted
        static::deleting(function ($fileStorage) {
            if ($fileStorage->location) {
                Storage::disk('public')->delete($fileStorage->location);
            }
        });
    }

    // public function getLocationAttribute($value)
    // {
    //     if (! $value) {
    //         return null;
    //     }

    //     return Storage::url($value);
    //     // Or if using public disk:
    //     // return asset('storage/' . $value);
    // }



}
