<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Widget extends Model
{
    protected $fillable = [
        'ref_id',
        'ref_type',
        'name',
        'label',
        'serial',
        'type_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($widget) {
            // Find the highest serial for the same `ref_type`
            $maxSerial = self::where('ref_type', $widget->ref_type)->max('serial');
            $widget->serial = $maxSerial ? $maxSerial + 1 : 1;
        });

        static::updating(function ($widget) {
            if ($widget->isDirty('serial')) {
                // If serial is changed, shift other widgets accordingly
                $oldSerial = $widget->getOriginal('serial');
                $newSerial = $widget->serial;

                if ($oldSerial < $newSerial) {
                    // Shift serials down if moving forward
                    self::where('ref_type', $widget->ref_type)
                        ->whereBetween('serial', [$oldSerial + 1, $newSerial])
                        ->decrement('serial');
                } elseif ($oldSerial > $newSerial) {
                    // Shift serials up if moving backward
                    self::where('ref_type', $widget->ref_type)
                        ->whereBetween('serial', [$newSerial, $oldSerial - 1])
                        ->increment('serial');
                }
            }
        });
    }


    /**
     * Get the parent model (store, store_page, theme, theme_page) of the widget.
     */
    public function ref()
    {
        return $this->morphTo();
    }

    /**
     * Get the widget type.
     */
    public function type()
    {
        return $this->belongsTo(WidgetType::class, 'type_id');
    }

     /**
     * Get the widget inputs.
     */
    public function widgetInputs()
    {
        return $this->hasMany(WidgetInput::class, 'widget_id')->where(["parent_id" => null]);
    }
}
