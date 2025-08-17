<?php

namespace App\Modules\FinancialManagement\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:1000',
            'description' => 'nullable|string|max:1000',
            'contact_person' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Vendor name is required.',
            'name.max' => 'Vendor name must not exceed 255 characters.',
            'phone.max' => 'Phone number must not exceed 20 characters.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Email must not exceed 255 characters.',
            'address.max' => 'Address must not exceed 1000 characters.',
            'description.max' => 'Description must not exceed 1000 characters.',
            'contact_person.max' => 'Contact person name must not exceed 255 characters.',
        ];
    }
}