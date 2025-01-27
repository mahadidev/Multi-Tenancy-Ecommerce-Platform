<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use App\Models\Product;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\WithStyles;

class ProductsExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    /**
    * @return \Illuminate\Support\Collection
    */
    protected $rowNumber = 0;
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Product::with('category', 'store', 'variants', 'brand')->authorized()->get();
    }

    public function headings(): array
    {
        return [
            ['Product List'], // Title row
            ['Serial No.', 'ID', 'Name', 'SKU', 'Short Description', 'Description', 'Brand', 'Category', 'Has In Stocks', 'Stock', 'Status', 'Variants', 'Is Trending', 'Has Discount', 'Discount To', 'Discount Type', 'Discount Amount', 'Price', 'Discount Price'] // Headers row
        ];
    }

    
    public function styles(Worksheet $sheet)
    {
        // Merge cells for title
        $sheet->mergeCells('A1:S1');
        
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
        $sheet->getStyle('A2:S2')->applyFromArray([
            'font' => [
                'bold' => true
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER
            ]
        ]);
    }

    /**
     * @param mixed $product
     * @return array
     */
    public function map($product): array
{
    $this->rowNumber++;
    return [
        $this->rowNumber,
        $product->id,
        $product->name,
        $product->sku,
        $product->short_description,
        $product->description,
        optional($product->brand)->name, // Safely handle null brand
        optional($product->category)->name, // Safely handle null category
        $product->has_in_stocks,
        $product->stock,
        $product->status,
        $product->variants->isNotEmpty() ? $product->variants->pluck('name')->join(', ') : null, // Safely handle null variants
        $product->is_trending,
        $product->has_discount,
        $product->discount_to,
        $product->discount_type,
        $product->discount_amount,
        $product->price,
        $product->discount_price,
    ];
}

}
