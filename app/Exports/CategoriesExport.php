<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use App\Models\Category;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\WithStyles;

class CategoriesExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $rowNumber = 0;
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Category::authorized()->where('type', 'product')->get();
    }

    public function headings(): array
    {
        return [
            ['Category List'], // Title row
            ['Serial No.', 'ID', 'Name'] // Headers row
        ];
    }

    
    public function styles(Worksheet $sheet)
    {
        // Merge cells for title
        $sheet->mergeCells('A1:C1');
        
        // Style for title
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 14
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER
            ]
        ]);
        
        // Style for headers
        $sheet->getStyle('A2:C2')->applyFromArray([
            'font' => [
                'bold' => true
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER
            ]
        ]);
    }

    /**
     * @param mixed $category
     * @return array
     */
    public function map($category): array
    {
        $this->rowNumber++;
        return [
            $this->rowNumber,
            $category->id,
            $category->name
        ];
    }
}
