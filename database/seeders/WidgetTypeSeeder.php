<?php

namespace Database\Seeders;

use App\Models\WidgetType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WidgetTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $widgetTypes = [
            ["type" => "layout", "label" => "Layout"], // id 1
            ["type" => "partial", "label" => "Partial"], // id 2
            ["type" => "section", "label" => "Section"] // id 3
        ];


        foreach($widgetTypes as $item){
            WidgetType::insertOrIgnore([
                'type' => $item['type'],
                'label' => $item['label'],
            ]);
        }
    }
}
