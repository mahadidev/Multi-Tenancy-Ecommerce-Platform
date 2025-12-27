<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Core performance indexes for multi-tenant queries
            $table->index(['store_id', 'created_at'], 'idx_orders_store_date');
            $table->index(['store_id', 'status', 'created_at'], 'idx_orders_store_status_created');
            $table->index(['store_id', 'status'], 'idx_orders_store_status');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->index(['order_id', 'store_id'], 'idx_order_items_order_store');
            $table->index(['store_id', 'product_id'], 'idx_order_items_store_product');
            $table->index(['store_id', 'created_at'], 'idx_order_items_store_date');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index(['store_id', 'status'], 'idx_products_store_status');
            $table->index(['store_id', 'is_featured', 'created_at'], 'idx_products_store_featured');
            $table->index(['store_id', 'category_id'], 'idx_products_store_category');
            $table->index(['store_id', 'name'], 'idx_products_store_name');
        });

        Schema::table('store_visitors', function (Blueprint $table) {
            $table->index(['store_id', 'visited_at DESC'], 'idx_store_visitors_store_date');
            $table->index(['store_id', 'ip_address'], 'idx_store_visitors_store_ip');
        });

        Schema::table('product_stocks', function (Blueprint $table) {
            $table->index(['product_id', 'store_id'], 'idx_product_stocks_product_store');
            $table->index(['store_id', 'quantity'], 'idx_product_stocks_store_quantity');
        });

        Schema::table('product_stock_histories', function (Blueprint $table) {
            $table->index(['product_stock_id', 'created_at'], 'idx_stock_histories_stock_date');
            $table->index(['store_id', 'created_at'], 'idx_stock_histories_store_date');
            $table->index(['store_id', 'type'], 'idx_stock_histories_store_type');
        });

        Schema::table('carts', function (Blueprint $table) {
            $table->index(['store_id', 'user_id'], 'idx_carts_store_user');
            $table->index(['store_id', 'session_id'], 'idx_carts_store_session');
            $table->index(['store_id', 'created_at'], 'idx_carts_store_date');
        });

        // Analytics indexes for reporting
        Schema::table('orders', function (Blueprint $table) {
            // Monthly analytics index
            $table->index(['store_id', DB::raw('DATE_TRUNC(\'month\', created_at)')], 'idx_orders_analytics_monthly');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->index(['store_id', 'created_at', 'price'], 'idx_order_items_analytics');
        });

        // Request logs for analytics
        if (Schema::hasTable('request_logs')) {
            Schema::table('request_logs', function (Blueprint $table) {
                $table->index(['store_id', 'created_at'], 'idx_request_logs_store_date');
                $table->index(['store_id', 'method', 'created_at'], 'idx_request_logs_store_method_date');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_store_date');
            $table->dropIndex('idx_orders_store_status_created');
            $table->dropIndex('idx_orders_store_status');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex('idx_order_items_order_store');
            $table->dropIndex('idx_order_items_store_product');
            $table->dropIndex('idx_order_items_store_date');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('idx_products_store_status');
            $table->dropIndex('idx_products_store_featured');
            $table->dropIndex('idx_products_store_category');
            $table->dropIndex('idx_products_store_name');
        });

        Schema::table('store_visitors', function (Blueprint $table) {
            $table->dropIndex('idx_store_visitors_store_date');
            $table->dropIndex('idx_store_visitors_store_ip');
        });

        Schema::table('product_stocks', function (Blueprint $table) {
            $table->dropIndex('idx_product_stocks_product_store');
            $table->dropIndex('idx_product_stocks_store_quantity');
        });

        Schema::table('product_stock_histories', function (Blueprint $table) {
            $table->dropIndex('idx_stock_histories_stock_date');
            $table->dropIndex('idx_stock_histories_store_date');
            $table->dropIndex('idx_stock_histories_store_type');
        });

        Schema::table('carts', function (Blueprint $table) {
            $table->dropIndex('idx_carts_store_user');
            $table->dropIndex('idx_carts_store_session');
            $table->dropIndex('idx_carts_store_date');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex('idx_orders_analytics_monthly');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex('idx_order_items_analytics');
        });

        if (Schema::hasTable('request_logs')) {
            Schema::table('request_logs', function (Blueprint $table) {
                $table->dropIndex('idx_request_logs_store_date');
                $table->dropIndex('idx_request_logs_store_method_date');
            });
        }
    }
};