<?php

namespace App\Modules\ProductManagement;

use App\Modules\BaseModule;

class ProductManagementModule extends BaseModule
{
    public function getName(): string
    {
        return 'ProductManagement';
    }

    public function getVersion(): string
    {
        return '1.0.0';
    }

    public function getDescription(): string
    {
        return 'Manages products, categories, brands, variants, and product-related functionality';
    }

    public function boot(): void
    {
        // Register product-specific middleware and policies
    }

    public function register(): void
    {
        // Register module services
        $this->app->singleton('product.service', function () {
            return new Services\ProductService();
        });

        $this->app->singleton('category.service', function () {
            return new Services\CategoryService();
        });

        $this->app->singleton('brand.service', function () {
            return new Services\BrandService();
        });

        $this->app->singleton('product.variant.service', function () {
            return new Services\ProductVariantService();
        });
    }

    public function getConfig(): array
    {
        return [
            'max_images_per_product' => 10,
            'max_variants_per_product' => 50,
            'enable_reviews' => true,
            'enable_ratings' => true,
            'auto_generate_sku' => true,
        ];
    }

    public function getDependencies(): array
    {
        return ['StoreManagement', 'FileManagement'];
    }
}