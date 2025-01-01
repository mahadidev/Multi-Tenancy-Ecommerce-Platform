<?php
namespace App\Services;


use App\Models\WidgetGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class StoreService {

    public static function getWidgetByGroupName($name, $widgetName = null){

        // Retrieve the widget group with its associated widgets
        $widgetGroup = WidgetGroup::with('widgets')->where('group_name', $name)->first();

        if(!$widgetGroup) {
            return null; // Return null if no group is found
        }

        // If a specific widget name is provided, return the matching widget
        if($widgetName){
            return $widgetGroup->widgets->firstWhere('meta_name', $widgetName);
        }

        // If no specific widget name is provided, return all widgets in the group
        return $widgetGroup;
    }

    
}