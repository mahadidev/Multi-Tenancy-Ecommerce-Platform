<?php
namespace App\Modules\ContentManagement\Services;

use App\Models\Widget;
use App\Models\WidgetInput;
use Illuminate\Http\Request;

class WidgetService {

    public static function getWidgets(Request $request){
        $query = Widget::query();

        if ($request->has('ref_type')) {
            $query->where('ref_type', 'App\Models\\'.$request->ref_type);
        }

        return $query->get();
    }

    public static function getWidgetById($id, Request $request){
        $query = Widget::query();
        return $query->find($id);
    }
   
}