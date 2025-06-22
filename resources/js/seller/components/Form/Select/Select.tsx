import { Select as SelectPr } from 'flowbite-react';
import { ChangeEventHandler, FC, InputHTMLAttributes } from 'react';
import Label from '../Label';

interface FormInputProps extends InputHTMLAttributes<HTMLSelectElement> {
	name: string;
	label?: string;
	type?: string;
	formState: any;
	formErrors: any;
	onChange: ChangeEventHandler<HTMLSelectElement>;
    children: React.ReactNode
}
const Select: FC<FormInputProps> = ({
	name,
	label,
	formState,
	formErrors,
    children,
	...rest
}) => {
	return (
		<div className="w-full flex flex-col gap-2">
			<Label name={name} label={label} required={rest.required} />

			<SelectPr
				name={name}
				value={formState[name] || ''}
				color={formErrors[name] ? 'failure' : 'gray'}
				helperText={formErrors[name]?.[0] || ''}
				{...rest}
			>
				{children}
			</SelectPr>
		</div>
	);
};

export default Select;
