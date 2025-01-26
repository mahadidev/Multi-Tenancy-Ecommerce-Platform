<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Models\Brand;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class BrandsImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        return new Brand([
            'name' => $row['name'],
            'image' => $row['image'] ?? null,
            'store_id' => authStore()
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:brands,name', 
            'image' => 'nullable|string|max:255'
        ];
    }
}

