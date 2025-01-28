<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Models\Category;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;


class CategoriesImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        return new Category([
            'name' => $row['name'],
            'type' => $row['type'] ?? 'product',
            'parent_id' => $row['parent_id'] ?? null,
            'store_id' => authStore()
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:categories,name', 
            'type' => 'in:post,product',
            'parent_id' => 'nullable|exists:categories,id'
        ];
    }
}
