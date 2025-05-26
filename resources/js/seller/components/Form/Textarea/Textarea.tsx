import { Label, Textarea as TextareaFR } from 'flowbite-react';
import { ChangeEventHandler, FC, TextareaHTMLAttributes } from 'react';

interface FormInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	name: string;
	label?: string;
	formState: any;
	formErrors: any;
	onChange: ChangeEventHandler<HTMLTextAreaElement>;
}
const Textarea: FC<FormInputProps> = ({
	name,
	label,
	formState,
	formErrors,
	...rest
}) => {
	return (
		<div className="w-full flex flex-col gap-2">
			{label && <Label htmlFor={name}>{label}</Label>}

			<TextareaFR
				name={name}
				value={formState[name] || ''}
				color={formErrors[name] ? 'failure' : 'gray'}
				helperText={formErrors[name]?.[0] || ''}
				{...rest}
			/>
		</div>
	);
};

export default Textarea;
