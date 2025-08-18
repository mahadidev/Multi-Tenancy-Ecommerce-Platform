<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Modules\ProductManagement\Models\Product;

class AssignProductThumbnails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:assign-thumbnails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign placeholder thumbnails to products without images';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Assigning placeholder thumbnails to products...');
        
        $placeholders = [
            '/images/seller/products/apple-imac-1.png',
            '/images/seller/products/apple-imac-2.png',
            '/images/seller/products/apple-imac-3.png',
        ];
        
        $products = Product::whereNull('thumbnail')
            ->orWhere('thumbnail', '')
            ->get();
        
        $count = 0;
        foreach ($products as $product) {
            $thumbnail = $placeholders[$product->id % count($placeholders)];
            $product->thumbnail = $thumbnail;
            $product->save();
            $count++;
            
            $this->line("Assigned thumbnail to: {$product->name}");
        }
        
        $this->info("Successfully assigned thumbnails to {$count} products!");
        
        return Command::SUCCESS;
    }
}