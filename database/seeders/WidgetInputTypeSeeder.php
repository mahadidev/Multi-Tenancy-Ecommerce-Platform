<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\WidgetInputType;

class WidgetInputTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ["type" => "text", "label" => "Text"], // id 1
            ["type" => "email", "label" => "Email"], // id 2
            ["type" => "image", "label" => "Image"], // id 3
            ["type" => "number", "label" => "Number"], // id 4
            ["type" => "textarea", "label" => "Textarea"], // id 5
            ["type" => "select", "label" => "Select"], // id 6
            ["type" => "array", "label" => "Array"], // id 7
            ["type" => "checkbox", "label" => "Checkbox"], // id 8
            ["type" => "radio", "label" => "Radio"], // id 9
            ["type" => "multi_select", "label" => "Multi Select"], // id 10
            ["type" => "date", "label" => "Date"], // id 11
            ["type" => "datetime", "label" => "DateTime"], // id 12
            ["type" => "time", "label" => "Time"], // id 13
            ["type" => "color", "label" => "Color"], // id 14
            ["type" => "toggle", "label" => "Toggle"] // id 15
        ];

        foreach ($types as $type) {
            WidgetInputType::updateOrCreate(
                ['value' => $type['type']], // Check if 'value' exists
                ['label' => $type['label']]  // Update or insert
            );
        }
    }
}
