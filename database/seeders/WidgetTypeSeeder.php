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
            [
                'type' => 'section',
                'label' => 'Section'
            ],
            [
                'type' => 'layout',
                'label' => 'Layout'
            ],
        ];


        foreach($widgetTypes as $item){
            WidgetType::insertOrIgnore([
                'type' => $item['type'],
                'label' => $item['label'],
            ]);
        }
    }
}
