import { Label, TextInput as TextInputFR } from 'flowbite-react';
import { ChangeEventHandler, FC, InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label?: string;
	type?: string;
	formState: any;
	formErrors: any;
	onChange: ChangeEventHandler<HTMLInputElement>;
}
const TextInput: FC<FormInputProps> = ({
	name,
	label,
	formState,
	formErrors,
	...rest
}) => {
	return (
		<div className="w-full flex flex-col gap-2">
			{label && <Label htmlFor={name}>{label}</Label>}

			<TextInputFR
				name={name}
				value={formState[name]}
				color={formErrors[name] ? 'failure' : 'gray'}
				helperText={formErrors[name]?.[0] || ''}
				{...rest}
			/>
		</div>
	);
};

export default TextInput;
