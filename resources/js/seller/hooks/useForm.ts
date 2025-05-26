/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';

export interface FormStateType {
	[Key: string]: string | number;
}

export interface FormErrorType {
	[key: string]: string[] | string;
}

interface ChangeEventTargetType {
	name: string;
	value: any;
	type: string;
	files: any;
}

interface FormProps {
	default?: FormStateType | any;
	errors?: FormErrorType | any;
	formValidationError?:
		| {
				message: string;
				errors: FormErrorType[];
		  }
		| FetchBaseQueryError
		| SerializedError
		| undefined;
}

const useForm = function (props?: FormProps) {
	const [formState, setFormState] = useState<FormStateType | any>(
		props?.default ?? {}
	);
	const [formErrors, setFormErrors] = useState<FormErrorType | any>({});

	// on change form input
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | any>,
		onChange?: CallableFunction
	) => {
		let { name, value, type, files }: ChangeEventTargetType = e.target;

		// Handle numeric inputs (including 0)
		if (type !== 'file' && type !== 'tel') {
			// Explicitly check for "0" string or 0 number
			if (value === '0' || value === 0) {
				value = 0;
			}
			// Check if value is a number (including "0")
			else if (/^\d+$/.test(value)) {
				value = parseInt(value, 10);
			}
		}

		// Handle file inputs
		if (files) {
			value = files[0];
			console.log(files);
		}

		// Call external onChange if provided
		if (onChange) {
			onChange({
				name: name,
				value: value,
			});
		}

		// Clear errors for this field
		setFormErrors((prev: any) => ({
			...prev,
			[name]: null,
			message: null,
		}));


		// Update form state - explicitly preserve 0
		setFormState((prev: any) => ({
			...prev,
			[name]: value === '' ? null : value, // Handle empty strings while preserving 0
		}));
	};

	// watch errors if any error set it form state error
	useEffect(() => {
		if (props?.errors) {
			setFormErrors(props.errors);
		}
	}, [props?.errors]);

	// formValidationError
	useEffect(() => {
		if (props && props.formValidationError) {
			setFormErrors((prev: FormErrorType) => ({
				...prev,
				message:
					props.formValidationError && 'message' in props.formValidationError
						? props.formValidationError.message
						: '',
				...(props.formValidationError && 'errors' in props.formValidationError
					? props.formValidationError.errors
					: {}),
			}));
		}
	}, [props?.formValidationError]);

	return { formState, setFormState, formErrors, setFormErrors, handleChange };
};

export default useForm;
