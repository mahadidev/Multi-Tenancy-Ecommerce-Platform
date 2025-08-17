import TextInput from '@seller/components/Form/TextInput/TextInput';
import QuickAddSelect from '@seller/components/Form/QuickAddSelect/QuickAddSelect';
import useExpense from '@seller/hooks/useExpense';
import useForm from '@seller/hooks/useForm';
import useVendor from '@seller/hooks/useVendor';
import {
    Button,
    FileInput,
    Label,
    Modal,
    Select,
    Textarea,
} from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';

const CreateExpenseModal: FC = function () {
	const [isOpen, setOpen] = useState(false);
	const { create } = useExpense();
	const { vendors, create: createVendor } = useVendor();

	const { handleChange, formState, formErrors, setFormState } = useForm({
		formValidationError: create.error,
		default: {
			category: 'general',
			payment_method: 'cash',
			expense_date: new Date().toISOString().split('T')[0], // "2025-08-17"
		},
	});

	const categories = [
		{ value: 'general', label: 'General' },
		{ value: 'office_supplies', label: 'Office Supplies' },
		{ value: 'marketing', label: 'Marketing' },
		{ value: 'rent', label: 'Rent' },
		{ value: 'utilities', label: 'Utilities' },
		{ value: 'transportation', label: 'Transportation' },
		{ value: 'meals', label: 'Meals & Entertainment' },
		{ value: 'equipment', label: 'Equipment' },
		{ value: 'software', label: 'Software & Subscriptions' },
		{ value: 'professional_services', label: 'Professional Services' },
		{ value: 'inventory', label: 'Inventory' },
		{ value: 'maintenance', label: 'Maintenance & Repairs' },
		{ value: 'insurance', label: 'Insurance' },
		{ value: 'taxes', label: 'Taxes' },
		{ value: 'other', label: 'Other' },
	];

	const paymentMethods = [
		{ value: 'cash', label: 'Cash' },
		{ value: 'card', label: 'Credit/Debit Card' },
		{ value: 'bank_transfer', label: 'Bank Transfer' },
		{ value: 'check', label: 'Check' },
		{ value: 'other', label: 'Other' },
	];

	const handleQuickAddVendor = async (vendorName: string) => {
		return new Promise<{ id: string | number; name: string }>((resolve) => {
			createVendor.submit({
				formData: { name: vendorName },
				onSuccess: (responseData: any) => {
					resolve({
						id: responseData.vendor.id,
						name: responseData.vendor.name,
					});
				},
			});
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		create.submit({
			formData: formState,
			onSuccess: () => {
				setOpen(false);
				setFormState({});
			},
		});
	};

	return (
		<>
			<Button color="primary" className="p-0" onClick={() => setOpen(true)}>
				<div className="flex items-center gap-x-3">
					<HiPlus className="text-xl" />
					Create Expense
				</div>
			</Button>
			<Modal onClose={() => setOpen(false)} show={isOpen} size="4xl">
				<Modal.Header>Create a new Expense</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<TextInput
								name="title"
								label="Expense Title"
								formState={formState}
								formErrors={formErrors}
								onChange={handleChange}
								required={true}
							/>
							<TextInput
								name="amount"
								label="Amount"
								type="number"
								step="0.01"
								formState={formState}
								formErrors={formErrors}
								onChange={handleChange}
								required={true}
							/>
						</div>

						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
							<div>
								<Label htmlFor="category" value="Category" />
								<Select
									id="category"
									name="category"
									value={formState.category || ''}
									onChange={handleChange}
									required
								>
									<option value="">Select category</option>
									{categories.map((category) => (
										<option
											key={category.value}
											value={category.value}
											selected={
												category.value === formState['category']
													? true
													: false
											}
										>
											{category.label}
										</option>
									))}
								</Select>
							</div>
							<div>
								<Label htmlFor="payment_method" value="Payment Method" />
								<Select
									id="payment_method"
									name="payment_method"
									value={formState.payment_method || ''}
									onChange={handleChange}
									required
								>
									<option value="">Select payment method</option>
									{paymentMethods.map((method) => (
										<option
											key={method.value}
											value={method.value}
											selected={
												method.value === formState['payment_method']
													? true
													: false
											}
										>
											{method.label}
										</option>
									))}
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
							<TextInput
								name="expense_date"
								label="Expense Date"
								type="date"
								formState={formState}
								formErrors={formErrors}
								onChange={handleChange}
								required={true}
							/>
							<QuickAddSelect
								name="vendor_id"
								label="Vendor"
								value={formState.vendor_id || ''}
								onChange={handleChange}
								options={vendors.map(vendor => ({ value: vendor.id, label: vendor.name }))}
								placeholder="Select vendor (optional)"
								onQuickAdd={handleQuickAddVendor}
							/>
						</div>

						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
							<TextInput
								name="receipt_number"
								label="Receipt Number"
								formState={formState}
								formErrors={formErrors}
								onChange={handleChange}
							/>
							<div>
								<Label htmlFor="status" value="Status" />
								<Select
									id="status"
									name="status"
									value={formState.status || 'approved'}
									onChange={handleChange}
								>
									<option value="pending">Pending</option>
									<option value="approved">Approved</option>
									<option value="rejected">Rejected</option>
								</Select>
							</div>
						</div>

						<div className="mt-6">
							<Label htmlFor="description" value="Description" />
							<Textarea
								id="description"
								name="description"
								value={formState.description || ''}
								onChange={handleChange}
								rows={3}
								placeholder="Enter expense description"
							/>
						</div>

						<div className="mt-6">
							<Label htmlFor="notes" value="Notes" />
							<Textarea
								id="notes"
								name="notes"
								value={formState.notes || ''}
								onChange={handleChange}
								rows={2}
								placeholder="Additional notes"
							/>
						</div>

						<div className="mt-6">
							<Label htmlFor="attachments" value="Attachments" />
							<FileInput
								id="attachments"
								name="attachments"
								multiple
								accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
								helperText="Maximum 5 files, 2MB each. Supported: JPEG, PNG, PDF, DOC, DOCX"
							/>
						</div>

						<div className="flex items-center gap-x-3 pt-6">
							<Button color="primary" type="submit" disabled={create.isLoading}>
								{create.isLoading && (
									<AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
								)}
								Create Expense
							</Button>
							<Button color="gray" onClick={() => setOpen(false)}>
								Cancel
							</Button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default CreateExpenseModal;
