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

Route::prefix('seller')->middleware(['auth:sanctum', 'store'])->group(function () {
    
    // Expense Management Routes - Logical permissions
    Route::prefix('expenses')->group(function () {
        // View expenses - anyone with expense permissions
        Route::middleware(['custom.permission:expenses.view,expenses.create,expenses.edit,expenses.delete'])->get('/', [ExpenseController::class, 'index'])->name('expenses.index');
        Route::middleware(['custom.permission:expenses.view,expenses.create,expenses.edit,expenses.delete'])->get('/create', [ExpenseController::class, 'create'])->name('expenses.create');
        Route::middleware(['custom.permission:expenses.view,expenses.create,expenses.edit,expenses.delete'])->get('/{expense}', [ExpenseController::class, 'show'])->name('expenses.show');
        Route::middleware(['custom.permission:expenses.view,expenses.create,expenses.edit,expenses.delete'])->get('/{expense}/edit', [ExpenseController::class, 'edit'])->name('expenses.edit');
        
        // Create expenses
        Route::middleware(['custom.permission:expenses.create'])->post('/', [ExpenseController::class, 'store'])->name('expenses.store');
        
        // Edit expenses
        Route::middleware(['custom.permission:expenses.edit'])->put('/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
        Route::middleware(['custom.permission:expenses.edit'])->patch('/{expense}', [ExpenseController::class, 'update'])->name('expenses.patch');
        Route::middleware(['custom.permission:expenses.edit'])->patch('/{expense}/status', [ExpenseController::class, 'updateStatus'])->name('expenses.update-status');
        
        // Delete expenses  
        Route::middleware(['custom.permission:expenses.delete'])->delete('/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');
        
        // Data and reports - anyone with expense access
        Route::middleware(['custom.permission:expenses.view,expenses.create,expenses.edit,expenses.delete,reports.financial'])->get('/data/statistics', [ExpenseController::class, 'statistics'])->name('expenses.statistics');
        Route::middleware(['custom.permission:expenses.view,expenses.create,expenses.edit,expenses.delete'])->get('/data/categories', [ExpenseController::class, 'categories'])->name('expenses.categories');
        Route::middleware(['custom.permission:expenses.view,expenses.create,expenses.edit,expenses.delete'])->get('/data/payment-methods', [ExpenseController::class, 'paymentMethods'])->name('expenses.payment-methods');
        Route::middleware(['custom.permission:expenses.view,expenses.create,expenses.edit,expenses.delete,reports.financial'])->post('/export', [ExpenseController::class, 'export'])->name('expenses.export');
    });
    
    // Vendor Management Routes - Anyone with vendor access or expense creation can view, only vendor managers can modify
    Route::prefix('vendors')->group(function () {
        // View vendors - anyone with vendor or expense create permissions 
        Route::middleware(['custom.permission:vendors.manage,expenses.create,expenses.edit'])->get('/', [VendorController::class, 'index'])->name('vendors.index');
        Route::middleware(['custom.permission:vendors.manage,expenses.create,expenses.edit'])->get('/{vendor}', [VendorController::class, 'show'])->name('vendors.show');
        
        // Manage vendors - only vendor managers
        Route::middleware(['custom.permission:vendors.manage'])->post('/', [VendorController::class, 'store'])->name('vendors.store');
        Route::middleware(['custom.permission:vendors.manage'])->put('/{vendor}', [VendorController::class, 'update'])->name('vendors.update');
        Route::middleware(['custom.permission:vendors.manage'])->patch('/{vendor}', [VendorController::class, 'update'])->name('vendors.patch');
        Route::middleware(['custom.permission:vendors.manage'])->delete('/{vendor}', [VendorController::class, 'destroy'])->name('vendors.destroy');
    });
    
});