<?php

namespace App\Exports;

use App\Models\Brand;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\WithStyles;

class BrandsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $rowNumber = 0;

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Brand::authorized()->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        // First row will be the title, second row will be the headers
        return [
            ['Brand List'], // Title row
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
     * @param mixed $brand
     * @return array
     */
    public function map($brand): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,    // Serial number
            $brand->id,          // ID
            $brand->name         // Name
        ];
    }
}