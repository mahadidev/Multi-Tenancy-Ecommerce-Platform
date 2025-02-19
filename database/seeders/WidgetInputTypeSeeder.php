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
            ['label' => 'Text', 'value' => 'text'],
            ['label' => 'Textarea', 'value' => 'textarea'],
            ['label' => 'Number', 'value' => 'number'],
            ['label' => 'Email', 'value' => 'email'],
            ['label' => 'Password', 'value' => 'password'],
            ['label' => 'Checkbox', 'value' => 'checkbox'],
            ['label' => 'Radio', 'value' => 'radio'],
            ['label' => 'Select', 'value' => 'select'],
            ['label' => 'Multi Select', 'value' => 'multi_select'],
            ['label' => 'Date', 'value' => 'date'],
            ['label' => 'DateTime', 'value' => 'datetime'],
            ['label' => 'Time', 'value' => 'time'],
            ['label' => 'File', 'value' => 'file'],
            ['label' => 'Image', 'value' => 'image'],
            ['label' => 'Color', 'value' => 'color'],
            ['label' => 'Toggle', 'value' => 'toggle'],
        ];

        foreach ($types as $type) {
            WidgetInputType::updateOrCreate(
                ['value' => $type['value']], // Check if 'value' exists
                ['label' => $type['label']]  // Update or insert
            );
        }
    }
}
