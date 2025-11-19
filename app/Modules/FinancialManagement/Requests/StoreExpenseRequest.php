<?php

namespace App\Modules\FinancialManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Modules\FinancialManagement\Models\Expense;

class StoreExpenseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && authStore();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $categories = array_keys(Expense::getCategories());
        $paymentMethods = array_keys(Expense::getPaymentMethods());
        $statuses = array_keys(Expense::getStatuses());

        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'amount' => 'required|numeric|min:0|max:999999.99',
            'category' => 'required|string|in:' . implode(',', $categories),
            'payment_method' => 'required|string|in:' . implode(',', $paymentMethods),
            'vendor_id' => 'nullable|exists:vendors,id',
            'receipt_number' => 'nullable|string|max:100',
            'expense_date' => 'required|date|before_or_equal:today',
            'status' => 'nullable|string|in:' . implode(',', $statuses),
            'notes' => 'nullable|string|max:1000',
            'attachments' => 'nullable|array|max:5',
            'attachments.*' => 'file|mimes:jpeg,png,pdf,doc,docx|max:2048', // 2MB max per file
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'title' => 'expense title',
            'amount' => 'expense amount',
            'category' => 'expense category',
            'payment_method' => 'payment method',
            'vendor' => 'vendor name',
            'receipt_number' => 'receipt number',
            'expense_date' => 'expense date',
            'attachments' => 'attachments',
            'attachments.*' => 'attachment file',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The expense title is required.',
            'amount.required' => 'The expense amount is required.',
            'amount.numeric' => 'The expense amount must be a valid number.',
            'amount.min' => 'The expense amount must be greater than or equal to 0.',
            'amount.max' => 'The expense amount cannot exceed 999,999.99.',
            'category.required' => 'Please select an expense category.',
            'category.in' => 'The selected expense category is invalid.',
            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'The selected payment method is invalid.',
            'expense_date.required' => 'The expense date is required.',
            'expense_date.date' => 'The expense date must be a valid date.',
            'expense_date.before_or_equal' => 'The expense date cannot be in the future.',
            'attachments.max' => 'You can upload a maximum of 5 files.',
            'attachments.*.file' => 'Each attachment must be a valid file.',
            'attachments.*.mimes' => 'Attachments must be of type: jpeg, png, pdf, doc, or docx.',
            'attachments.*.max' => 'Each attachment must be no larger than 2MB.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set default status if not provided
        if (!$this->filled('status')) {
            $this->merge([
                'status' => 'approved'
            ]);
        }

        // Clean up amount formatting
        if ($this->filled('amount')) {
            $amount = str_replace([',', ' '], '', $this->amount);
            $this->merge([
                'amount' => $amount
            ]);
        }
    }
}
