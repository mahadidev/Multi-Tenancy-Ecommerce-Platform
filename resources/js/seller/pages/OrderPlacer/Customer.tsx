import { Select, TextInput } from '@seller/components';
import useCustomer from '@seller/hooks/useCustomer';
import useForm from '@seller/hooks/useForm';
import { setCustomer, setPaymentMethod } from '@seller/store/slices/orderPlacerSlice';
import { useAppDispatch, useAppSelector } from '@seller/store/store';
import { CustomerType } from '@type/customersType';
import { useEffect } from 'react';

const Customer = () => {
	const { formErrors, formState, handleChange, setFormState } = useForm({
        default: {
            "status": "completed",
            'is_payed': 1,
            'is_approved': 0,
        }
    });
    const {paymentMethod} = useAppSelector((state) => state.orderPlacer)
	const { customers } = useCustomer();
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setCustomer(formState));
	}, [dispatch, formState]);

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
					name="payment_method"
					label="Paymant Method"
					formState={formState}
					formErrors={formErrors}
					type="string"
					placeholder="Payment Method"
					onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
						dispatch(setPaymentMethod(event.target.value));
                        if(event.target.value === "Pending"){
                            setFormState((prev: any) => ({
                                ...prev,
                                "is_payed": 0
                            }))
                        }
					}}
				>
					{['Cash', 'Card', 'Bank', 'Bkash', 'Pending'].map((option) => (
						<option
							key={option}
							value={option}
							className="uppercase"
							selected={paymentMethod === option}
						>
							{option}
						</option>
					))}
				</Select>
			</div>
		</div>
	);
};
export default Customer;
