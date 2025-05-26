import { Select, TextInput } from '@seller/components';
import useCustomer from '@seller/hooks/useCustomer';
import useForm from '@seller/hooks/useForm';
import { setCustomer } from '@seller/store/slices/orderPlacerSlice';
import { useAppDispatch } from '@seller/store/store';
import { CustomerType } from '@type/customersType';
import { useEffect } from 'react';

const Customer = () => {
	const { formErrors, formState, handleChange, setFormState } = useForm({
        default: {
            "status": "paid"
        }
    });
	const { customers } = useCustomer();
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setCustomer(formState));
	}, [dispatch, formState]);

	useEffect(() => {}, []);

	return (
		<div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
			<div className="grid grid-cols-2 gap-4">
				<Select
					name="customer"
					formState={formState}
					formErrors={formErrors}
					onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
						const customer = customers.find(
							(customer: CustomerType) =>
								customer.id === Number(event.target.value)
						);

						if (customer) {
							setFormState((prev: any) => ({
								...prev,
								name: customer.name,
								phone: customer.phone,
								email: customer.email,
								address: customer.address,
							}));
						}
					}}
					label="Select Customer"
				>
					<option>Choose a customer</option>
					{customers.map((customer) => (
						<option value={customer.id}>{customer.name}</option>
					))}
				</Select>
				<TextInput
					name="name"
					label="Customer Name"
					formState={formState}
					formErrors={formErrors}
					onChange={handleChange}
					placeholder="Customer Name"
				/>
				<TextInput
					name="phone"
					label="Customer Phone"
					formState={formState}
					formErrors={formErrors}
					onChange={handleChange}
					type="number"
					placeholder="Customer Phone"
				/>
				<TextInput
					name="email"
					label="Customer Email"
					formState={formState}
					formErrors={formErrors}
					type="email"
					onChange={handleChange}
					placeholder="Customer Email"
				/>
				<TextInput
					name="address"
					label="Customer address"
					formState={formState}
					formErrors={formErrors}
					type="string"
					onChange={handleChange}
					placeholder="Customer address"
				/>
				<Select
					name="status"
					label="Order Status"
					formState={formState}
					formErrors={formErrors}
					type="string"
					onChange={handleChange}
					placeholder="Customer address"
				>
					{['Paid', 'Pending'].map((option) => (
						<option key={option} value={option} className="uppercase">
							{option}
						</option>
					))}
				</Select>
			</div>
		</div>
	);
};
export default Customer;
