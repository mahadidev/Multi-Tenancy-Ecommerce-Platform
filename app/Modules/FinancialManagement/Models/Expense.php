<?php

namespace App\Modules\FinancialManagement\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use App\Modules\StoreManagement\Models\Store;
use App\Modules\UserManagement\Models\User;
use Carbon\Carbon;

class Expense extends Model
{
    protected $fillable = [
        'store_id',
        'user_id',
        'title',
        'description',
        'amount',
        'category',
        'payment_method',
        'vendor_id',
        'vendor',
        'receipt_number',
        'expense_date',
        'status',
        'attachments',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'attachments' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    /**
     * Available expense categories
     */
    public static function getCategories(): array
    {
        return [
            'general' => 'General',
            'office_supplies' => 'Office Supplies',
            'marketing' => 'Marketing',
            'rent' => 'Rent',
            'utilities' => 'Utilities',
            'transportation' => 'Transportation',
            'meals' => 'Meals & Entertainment',
            'equipment' => 'Equipment',
            'software' => 'Software & Subscriptions',
            'professional_services' => 'Professional Services',
            'inventory' => 'Inventory',
            'maintenance' => 'Maintenance & Repairs',
            'insurance' => 'Insurance',
            'taxes' => 'Taxes',
            'other' => 'Other',
        ];
    }

    /**
     * Available payment methods
     */
    public static function getPaymentMethods(): array
    {
        return [
            'cash' => 'Cash',
            'card' => 'Credit/Debit Card',
            'bank_transfer' => 'Bank Transfer',
            'check' => 'Check',
            'other' => 'Other',
        ];
    }

    /**
     * Available statuses
     */
    public static function getStatuses(): array
    {
        return [
            'pending' => 'Pending',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
        ];
    }

    // === Relationships ===

    /**
     * Get the store that owns the expense
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the user who created the expense
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the vendor for the expense (only if vendor belongs to same store)
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    // === Scopes ===

    /**
     * Scope expenses by store
     */
    public function scopeForStore(Builder $query, int $storeId): Builder
    {
        return $query->where('store_id', $storeId);
    }

    /**
     * Scope expenses by status
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope expenses by category
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Scope expenses by date range
     */
    public function scopeByDateRange(Builder $query, Carbon $startDate, Carbon $endDate): Builder
    {
        return $query->whereBetween('expense_date', [$startDate, $endDate]);
    }

    /**
     * Scope expenses for current month
     */
    public function scopeCurrentMonth(Builder $query): Builder
    {
        return $query->whereMonth('expense_date', now()->month)
                    ->whereYear('expense_date', now()->year);
    }

    /**
     * Scope expenses for current year
     */
    public function scopeCurrentYear(Builder $query): Builder
    {
        return $query->whereYear('expense_date', now()->year);
    }

    // === Accessors & Mutators ===

    /**
     * Get formatted amount
     */
    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 2);
    }

    /**
     * Get category label
     */
    public function getCategoryLabelAttribute(): string
    {
        return self::getCategories()[$this->category] ?? ucfirst($this->category);
    }

    /**
     * Get payment method label
     */
    public function getPaymentMethodLabelAttribute(): string
    {
        return self::getPaymentMethods()[$this->payment_method] ?? ucfirst($this->payment_method);
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return self::getStatuses()[$this->status] ?? ucfirst($this->status);
    }

    /**
     * Get status color for frontend
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'warning',
            'approved' => 'success',
            'rejected' => 'danger',
            default => 'secondary'
        };
    }

    // === Helper Methods ===

    /**
     * Check if expense is approved
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if expense is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if expense is rejected
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Approve the expense
     */
    public function approve(): bool
    {
        return $this->update(['status' => 'approved']);
    }

    /**
     * Reject the expense
     */
    public function reject(): bool
    {
        return $this->update(['status' => 'rejected']);
    }

    /**
     * Get total expenses for a store
     */
    public static function getTotalForStore(int $storeId, ?Carbon $startDate = null, ?Carbon $endDate = null): float
    {
        $query = static::forStore($storeId)->where('status', 'approved');
        
        if ($startDate && $endDate) {
            $query->byDateRange($startDate, $endDate);
        }
        
        return $query->sum('amount');
    }

    /**
     * Get expenses by category for a store
     */
    public static function getByCategory(int $storeId, ?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $query = static::forStore($storeId)->where('status', 'approved');
        
        if ($startDate && $endDate) {
            $query->byDateRange($startDate, $endDate);
        }
        
        return $query->selectRaw('category, SUM(amount) as total')
                    ->groupBy('category')
                    ->pluck('total', 'category')
                    ->toArray();
    }
}