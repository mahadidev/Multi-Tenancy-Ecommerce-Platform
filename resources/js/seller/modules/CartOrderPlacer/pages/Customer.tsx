import useForm from '@seller/_hooks/useForm';
import { TextInput } from '@seller/components';
import { useEffect } from 'react';
import { useCartOrderPlacer } from '../hooks';
import { OrderPlacerCustomer } from '../types';

const Customer = () => {
    const { formState, handleChange, formErrors } = useForm({
        default: {
            name: '',
            email: '',
            phone: '',
            address: '',
        }
    });

    const { setOrderCustomer } = useCartOrderPlacer();

    useEffect(() => {
        setOrderCustomer(formState as OrderPlacerCustomer);
    }, [formState, setOrderCustomer]);

    return (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Customer Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <TextInput
                    name="name"
                    label="Customer Name"
                    formState={formState}
                    formErrors={formErrors}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                />

                <TextInput
                    name="phone"
                    label="Phone Number"
                    formState={formState}
                    formErrors={formErrors}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    type="tel"
                />

                <TextInput
                    name="email"
                    label="Email Address"
                    formState={formState}
                    formErrors={formErrors}
                    type="email"
                    onChange={handleChange}
                    placeholder="Enter email address"
                />

                <TextInput
                    name="address"
                    label="Address"
                    formState={formState}
                    formErrors={formErrors}
                    onChange={handleChange}
                    placeholder="Enter customer address"
                />
            </div>
        </div>
    );
};

export default Customer;
