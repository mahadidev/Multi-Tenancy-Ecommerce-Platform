<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\Schema\Builder;
use Illuminate\Support\Facades\Schema;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register model aliases for backward compatibility
        $this->registerModelAliases();
    }

    /**
     * Register model aliases to maintain backward compatibility
     */
    private function registerModelAliases(): void
    {
        try {
        // Product Management models
        if (!class_exists(\App\Models\Product::class)) {
            class_alias(\App\Modules\ProductManagement\Models\Product::class, \App\Models\Product::class);
        }
        if (!class_exists(\App\Models\Brand::class)) {
            class_alias(\App\Modules\ProductManagement\Models\Brand::class, \App\Models\Brand::class);
        }
        if (!class_exists(\App\Models\Category::class)) {
            class_alias(\App\Modules\ProductManagement\Models\Category::class, \App\Models\Category::class);
        }
        if (!class_exists(\App\Models\ProductVariant::class)) {
            class_alias(\App\Modules\ProductManagement\Models\ProductVariant::class, \App\Models\ProductVariant::class);
        }
        if (!class_exists(\App\Models\ProductVariantOption::class)) {
            class_alias(\App\Modules\ProductManagement\Models\ProductVariantOption::class, \App\Models\ProductVariantOption::class);
        }

        // Order Management models
        class_alias(\App\Modules\OrderManagement\Models\Order::class, \App\Models\Order::class);
        class_alias(\App\Modules\OrderManagement\Models\OrderItem::class, \App\Models\OrderItem::class);
        class_alias(\App\Modules\OrderManagement\Models\Cart::class, \App\Models\Cart::class);

        // Inventory Management models
        class_alias(\App\Modules\InventoryManagement\Models\ProductStock::class, \App\Models\ProductStock::class);
        class_alias(\App\Modules\InventoryManagement\Models\ProductStockHistory::class, \App\Models\ProductStockHistory::class);
        class_alias(\App\Modules\InventoryManagement\Models\ProductStockItem::class, \App\Models\ProductStockItem::class);

        // Store Management models
        class_alias(\App\Modules\StoreManagement\Models\Store::class, \App\Models\Store::class);
        class_alias(\App\Modules\StoreManagement\Models\StoreMenu::class, \App\Models\StoreMenu::class);
        class_alias(\App\Modules\StoreManagement\Models\StoreMenuItem::class, \App\Models\StoreMenuItem::class);
        class_alias(\App\Modules\StoreManagement\Models\StoreType::class, \App\Models\StoreType::class);
        class_alias(\App\Modules\StoreManagement\Models\StoreSession::class, \App\Models\StoreSession::class);
        class_alias(\App\Modules\StoreManagement\Models\StoreSocialMedia::class, \App\Models\StoreSocialMedia::class);
        class_alias(\App\Modules\StoreManagement\Models\StoreShipment::class, \App\Models\StoreShipment::class);
        class_alias(\App\Modules\StoreManagement\Models\StoreApiCredential::class, \App\Models\StoreApiCredential::class);

        // Content Management models
        class_alias(\App\Modules\ContentManagement\Models\StorePage::class, \App\Models\StorePage::class);
        class_alias(\App\Modules\ContentManagement\Models\Widget::class, \App\Models\Widget::class);
        class_alias(\App\Modules\ContentManagement\Models\StorePageWidget::class, \App\Models\StorePageWidget::class);
        class_alias(\App\Modules\ContentManagement\Models\Blog::class, \App\Models\Blog::class);
        class_alias(\App\Modules\ContentManagement\Models\PageType::class, \App\Models\PageType::class);
        class_alias(\App\Modules\ContentManagement\Models\SvgIcon::class, \App\Models\SvgIcon::class);
        class_alias(\App\Modules\ContentManagement\Models\WidgetInput::class, \App\Models\WidgetInput::class);
        class_alias(\App\Modules\ContentManagement\Models\WidgetInputType::class, \App\Models\WidgetInputType::class);
        class_alias(\App\Modules\ContentManagement\Models\WidgetType::class, \App\Models\WidgetType::class);

        // Subscription Management models
        class_alias(\App\Modules\SubscriptionManagement\Models\StoreSubscription::class, \App\Models\StoreSubscription::class);
        class_alias(\App\Modules\SubscriptionManagement\Models\Subscription::class, \App\Models\Subscription::class);
        class_alias(\App\Modules\SubscriptionManagement\Models\SubscriptionFeature::class, \App\Models\SubscriptionFeature::class);

        // User Management models
        class_alias(\App\Modules\UserManagement\Models\User::class, \App\Models\User::class);

        // Customer Management models
        class_alias(\App\Modules\CustomerManagement\Models\Subscriber::class, \App\Models\Subscriber::class);

        // Notification Management models
        class_alias(\App\Modules\NotificationManagement\Models\Notification::class, \App\Models\Notification::class);

        // Contact Management models
        class_alias(\App\Modules\ContactManagement\Models\Contact::class, \App\Models\Contact::class);

        // Payment Management models
        class_alias(\App\Modules\PaymentManagement\Models\Payment::class, \App\Models\Payment::class);

        // Analytics Management models
        class_alias(\App\Modules\AnalyticsManagement\Models\RequestLog::class, \App\Models\RequestLog::class);
        class_alias(\App\Modules\AnalyticsManagement\Models\StoreVisitor::class, \App\Models\StoreVisitor::class);

        // Product Management models (additional)
        class_alias(\App\Modules\ProductManagement\Models\ProductReview::class, \App\Models\ProductReview::class);
        class_alias(\App\Modules\ProductManagement\Models\ProductCreateHistory::class, \App\Models\ProductCreateHistory::class);

        // Financial Management models
        class_alias(\App\Modules\FinancialManagement\Models\Expense::class, \App\Models\Expense::class);

        // Theme Management models
        class_alias(\App\Modules\ThemeManagement\Models\Theme::class, \App\Models\Theme::class);
        class_alias(\App\Modules\ThemeManagement\Models\ThemePage::class, \App\Models\ThemePage::class);

        // File Management models
        class_alias(\App\Modules\FileManagement\Models\FileStorage::class, \App\Models\FileStorage::class);
        } catch (\Exception $e) {
            // Ignore class alias conflicts during development
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        // Ensure core database tables exist
        if (app()->environment() !== 'testing') {
            \App\Modules\SystemManagement\Services\DatabaseMaintenanceService::ensureCoreTables();
        }

        // // load core migration
        // $this->loadMigrationsFrom(database_path('migrations/core/0001_01_01_000000_create_users_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/core/0001_01_01_000001_create_cache_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/core/0001_01_01_000002_create_jobs_table.php'));

        // // load store migration
        // $this->loadMigrationsFrom(database_path('migrations/store/2024_12_15__103305_create_store_types_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/store/2024_12_16_125524_create_stores_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/store/2025_01_06_103755_create_store_sessions_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/store/2025_01_20_114854_create_store_social_media_table.php'));

        // // load store subscription
        // $this->loadMigrationsFrom(database_path('migrations/subscription/2025_03_09_122829_create_subscriptions_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/subscription/2025_03_09_122832_create_subscription_features_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/subscription/2025_03_15_155557_create_store_subscriptions_table.php'));

        // // load core migration
        // $this->loadMigrationsFrom(database_path('migrations/core/2024_12_17_104302_create_permission_tables.php'));
        // $this->loadMigrationsFrom(database_path('migrations/core/2024_12_26_145422_create_personal_access_tokens_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/core/2024_12_28_145345_create_request_logs_table.php'));

        // // load payment migration
        // $this->loadMigrationsFrom(database_path('migrations/payment/2025_03_10_141613_create_payments_table.php'));

        // // _____ECOMMERCE
        // // load categorie migration
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/category/2024_12_18_122825_create_categories_table.php'));

        // // load brand migration
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/brand/2024_12_20_100054_create_product_brands_table.php'));

        // // load product migration
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/product/2024_12_21_160106_create_products_table.php'));

        // // load product variants migration
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/product/variant/2024_12_21_160300_create_product_variants_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/product/variant/2025_01_28_110752_create_product_variant_options_table.php'));

        // // load stock migration
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/stock/2025_07_01_215858_create_product_stocks_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/stock/2025_07_01_215913_create_product_stock_items_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/stock/2025_07_02_185238_create_product_stock_histories_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/stock/2025_07_18_231735_create_product_create_histories_table.php'));

        // // load cart migration
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/cart/2025_01_04_100501_create_carts_table.php'));

        // // load order migration
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/order/2025_01_16_152846_create_orders_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/order/2025_07_16_153221_create_order_items_table.php'));

        // // load shipment migration
        // $this->loadMigrationsFrom(database_path('migrations/ecommerce/shipment/2025_03_23_121415_create_store_shipments_table.php'));

        // // load widget migration
        // $this->loadMigrationsFrom(database_path('migrations/widget/2024_12_24_224816_create_widget_types_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/widget/2025_02_19_130650_create_widgets_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/widget/input/2025_02_19_131141_create_widget_input_types_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/widget/input/2025_02_19_131506_create_widget_inputs_table.php'));

        // // load menus migration
        // $this->loadMigrationsFrom(database_path('migrations/menu/2025_02_09_100420_create_store_menus_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/menu/2025_02_09_103330_create_store_menu_items_table.php'));

        // // load page migration
        // $this->loadMigrationsFrom(database_path('migrations/page/2025_01_15_164507_create_page_types_table.php'));
        // $this->loadMigrationsFrom(database_path('migrations/page/2025_02_19_130652_create_store_pages_table.php'));

        // // load subscriber migration
        // $this->loadMigrationsFrom(database_path('migrations/subscriber/2025_01_04_162014_create_subscribers_table.php'));

        // // load visitor migration
        // $this->loadMigrationsFrom(database_path('migrations/visitor/2025_02_04_102240_create_store_visitors_table.php'));

        // // load storage
        // $this->loadMigrationsFrom(database_path('migrations/storage/2025_01_13_140735_create_file_storages_table.php'));

        // // load notification
        // $this->loadMigrationsFrom(database_path('migrations/notification/2025_01_22_112739_create_notifications_table.php'));

        // // load contact
        // $this->loadMigrationsFrom(database_path('migrations/contact/2025_01_02_163728_create_contacts_table.php'));
    }
}
