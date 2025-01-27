<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\WithStyles;
use App\Models\User;


class CustomersExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $rowNumber = 0;

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return User::whereJsonContains('store_id', authStore())->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        // First row will be the title, second row will be the headers
        return [
            ['User List'], // Title row
            ['Serial No.', 'ID', 'Name', 'Email', 'Phone', 'Address'] // Headers row
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Merge cells for title
        $sheet->mergeCells('A1:F1');

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
        $sheet->getStyle('A2:F2')->applyFromArray([
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
            $this->rowNumber,
            $brand->id,
            $brand->name,
            $brand->email,
            $brand->phone,
            $brand->address,
        ];
    }
}
