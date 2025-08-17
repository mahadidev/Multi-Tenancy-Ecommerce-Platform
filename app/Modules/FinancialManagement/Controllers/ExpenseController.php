<?php

namespace App\Modules\FinancialManagement\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\FinancialManagement\Models\Expense;
use App\Modules\FinancialManagement\Requests\StoreExpenseRequest;
use App\Modules\FinancialManagement\Requests\UpdateExpenseRequest;
use App\Modules\FinancialManagement\Resources\ExpenseResource;
use App\Modules\FinancialManagement\Resources\ExpenseCollection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class ExpenseController extends Controller
{
    /**
     * Display a listing of expenses for the current store
     */
    public function index(Request $request): JsonResponse
    {
        $storeId = authStore();

        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }

        $query = Expense::with(['user', 'store', 'vendor'])
                        ->forStore($storeId)
                        ->latest('expense_date');

        // Apply filters
        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }

        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);
            $query->byDateRange($startDate, $endDate);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('vendor', 'like', "%{$search}%")
                  ->orWhere('receipt_number', 'like', "%{$search}%")
                  ->orWhereHas('vendor', function ($vendorQuery) use ($search) {
                      $vendorQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('email', 'like', "%{$search}%")
                                  ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = $request->get('per_page', 15);
        $expenses = $query->paginate($perPage);

        return response()->json([
            'status' => 200,
            'data' => [
                'expenses' => new ExpenseCollection($expenses),
                'meta' => [
                    'total' => $expenses->total(),
                    'per_page' => $expenses->perPage(),
                    'current_page' => $expenses->currentPage(),
                    'last_page' => $expenses->lastPage(),
                ],
                'summary' => [
                    'total_amount' => Expense::getTotalForStore($storeId),
                    'monthly_total' => Expense::forStore($storeId)->currentMonth()->sum('amount'),
                    'yearly_total' => Expense::forStore($storeId)->currentYear()->sum('amount'),
                ],
            ],
        ], 200);
    }

    /**
     * Store a newly created expense
     */
    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $storeId = authStore();

        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }

        $expenseData = $request->validated();
        $expenseData['store_id'] = $storeId;
        $expenseData['user_id'] = auth()->id();

        // Handle file attachments if provided
        if ($request->hasFile('attachments')) {
            $attachments = [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('expenses', 'public');
                $attachments[] = $path;
            }
            $expenseData['attachments'] = $attachments;
        }

        $expense = Expense::create($expenseData);
        $expense->load(['user', 'store', 'vendor']);

        return response()->json([
            'status' => 200,
            'message' => 'Expense created successfully',
            'data' => [
                'expense' => new ExpenseResource($expense),
            ],
        ], 200);
    }

    /**
     * Display the specified expense
     */
    public function show(Request $request, $id): JsonResponse
    {
        $storeId = authStore();

        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }

        $expense = Expense::with(['user', 'store', 'vendor'])
                          ->forStore($storeId)
                          ->find($id);

        if (!$expense) {
            return response()->json([
                'status' => 404,
                'message' => 'Expense not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => [
                'expense' => new ExpenseResource($expense),
            ],
        ], 200);
    }

    /**
     * Update the specified expense
     */
    public function update(UpdateExpenseRequest $request, $id): JsonResponse
    {
        $storeId = authStore();

        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }

        $expense = Expense::forStore($storeId)->find($id);

        if (!$expense) {
            return response()->json([
                'status' => 404,
                'message' => 'Expense not found',
            ], 404);
        }

        $expenseData = $request->validated();

        // Handle file attachments if provided
        if ($request->hasFile('attachments')) {
            $attachments = $expense->attachments ?? [];
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('expenses', 'public');
                $attachments[] = $path;
            }
            $expenseData['attachments'] = $attachments;
        }

        $expense->update($expenseData);
        $expense->load(['user', 'store', 'vendor']);

        return response()->json([
            'status' => 200,
            'message' => 'Expense updated successfully',
            'data' => [
                'expense' => new ExpenseResource($expense),
            ],
        ], 200);
    }

    /**
     * Remove the specified expense
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $storeId = authStore();

        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }

        $expense = Expense::forStore($storeId)->find($id);

        if (!$expense) {
            return response()->json([
                'status' => 404,
                'message' => 'Expense not found',
            ], 404);
        }

        $expense->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Expense deleted successfully',
        ], 200);
    }

    /**
     * Update expense status
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $storeId = authStore();

        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }

        $expense = Expense::forStore($storeId)->find($id);

        if (!$expense) {
            return response()->json([
                'status' => 404,
                'message' => 'Expense not found',
            ], 404);
        }

        $expense->update(['status' => $request->status]);
        $expense->load(['user', 'store', 'vendor']);

        return response()->json([
            'status' => 200,
            'message' => 'Expense status updated successfully',
            'data' => [
                'expense' => new ExpenseResource($expense),
            ],
        ], 200);
    }

    /**
     * Get expense statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $storeId = authStore();

        if (!$storeId) {
            return response()->json([
                'status' => 400,
                'message' => 'Store not selected',
            ], 400);
        }

        $startDate = $request->filled('start_date') ? Carbon::parse($request->start_date) : null;
        $endDate = $request->filled('end_date') ? Carbon::parse($request->end_date) : null;

        $statistics = [
            'total_expenses' => Expense::getTotalForStore($storeId, $startDate, $endDate),
            'monthly_expenses' => Expense::forStore($storeId)->currentMonth()->sum('amount'),
            'yearly_expenses' => Expense::forStore($storeId)->currentYear()->sum('amount'),
            'by_category' => Expense::getByCategory($storeId, $startDate, $endDate),
            'by_status' => [
                'pending' => Expense::forStore($storeId)->byStatus('pending')->count(),
                'approved' => Expense::forStore($storeId)->byStatus('approved')->count(),
                'rejected' => Expense::forStore($storeId)->byStatus('rejected')->count(),
            ],
            'count' => [
                'total' => Expense::forStore($storeId)->count(),
                'this_month' => Expense::forStore($storeId)->currentMonth()->count(),
                'this_year' => Expense::forStore($storeId)->currentYear()->count(),
            ],
        ];

        return response()->json([
            'status' => 200,
            'data' => $statistics,
        ], 200);
    }

    /**
     * Get expense categories
     */
    public function categories(): JsonResponse
    {
        return response()->json([
            'status' => 200,
            'data' => [
                'categories' => Expense::getCategories(),
            ],
        ], 200);
    }

    /**
     * Get payment methods
     */
    public function paymentMethods(): JsonResponse
    {
        return response()->json([
            'status' => 200,
            'data' => [
                'payment_methods' => Expense::getPaymentMethods(),
            ],
        ], 200);
    }

    /**
     * Export expenses (future implementation)
     */
    public function export(Request $request): JsonResponse
    {
        // This can be implemented later with Excel/CSV export functionality
        return response()->json([
            'status' => 501,
            'message' => 'Export functionality not implemented yet',
        ], 501);
    }
}
