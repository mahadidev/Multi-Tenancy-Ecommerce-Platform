<?php

use Illuminate\Support\Facades\Route;
use App\Modules\FinancialManagement\Controllers\ExpenseController;
use App\Modules\FinancialManagement\Controllers\VendorController;

/*
|--------------------------------------------------------------------------
| Financial Management API Routes
|--------------------------------------------------------------------------
|
| Here are the API routes for financial management functionality
|
*/

Route::prefix('api/v1/seller')->middleware(['auth:sanctum', 'store'])->group(function () {
    
    // Expense Management Routes
    Route::prefix('expenses')->group(function () {
        // Basic CRUD operations
        Route::get('/', [ExpenseController::class, 'index'])->name('expenses.index');
        Route::post('/', [ExpenseController::class, 'store'])->name('expenses.store');
        Route::get('/create', [ExpenseController::class, 'create'])->name('expenses.create');
        Route::get('/{expense}', [ExpenseController::class, 'show'])->name('expenses.show');
        Route::put('/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
        Route::patch('/{expense}', [ExpenseController::class, 'update'])->name('expenses.patch');
        Route::delete('/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');
        Route::get('/{expense}/edit', [ExpenseController::class, 'edit'])->name('expenses.edit');
        
        // Additional routes
        Route::patch('/{expense}/status', [ExpenseController::class, 'updateStatus'])->name('expenses.update-status');
        Route::get('/data/statistics', [ExpenseController::class, 'statistics'])->name('expenses.statistics');
        Route::get('/data/categories', [ExpenseController::class, 'categories'])->name('expenses.categories');
        Route::get('/data/payment-methods', [ExpenseController::class, 'paymentMethods'])->name('expenses.payment-methods');
        Route::post('/export', [ExpenseController::class, 'export'])->name('expenses.export');
    });
    
    // Vendor Management Routes
    Route::prefix('vendors')->group(function () {
        Route::get('/', [VendorController::class, 'index'])->name('vendors.index');
        Route::post('/', [VendorController::class, 'store'])->name('vendors.store');
        Route::get('/{vendor}', [VendorController::class, 'show'])->name('vendors.show');
        Route::put('/{vendor}', [VendorController::class, 'update'])->name('vendors.update');
        Route::patch('/{vendor}', [VendorController::class, 'update'])->name('vendors.patch');
        Route::delete('/{vendor}', [VendorController::class, 'destroy'])->name('vendors.destroy');
    });
    
});