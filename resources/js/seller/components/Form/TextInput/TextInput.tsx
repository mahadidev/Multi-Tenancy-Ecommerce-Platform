import { TextInput as TextInputFR, TextInputProps } from 'flowbite-react';
import { ChangeEventHandler, ForwardedRef, forwardRef } from 'react';
import Label from '../Label';

interface FormInputProps extends TextInputProps {
	name: string;
	label?: string;
	type?: string;
	formState: any;
	formErrors: any;
	onChange: ChangeEventHandler<HTMLInputElement>;
}

const TextInput = forwardRef<HTMLInputElement, FormInputProps>(
	(
		{ name, label, formState, formErrors, ...rest },
		ref: ForwardedRef<HTMLInputElement>
	) => {
		return (
			<div className="w-full flex flex-col gap-2">
				<Label name={name} label={label} required={rest.required} />

				<TextInputFR
					ref={ref}
					name={name}
					value={formState[name]}
					color={formErrors[name] ? 'failure' : 'gray'}
					helperText={formErrors[name]?.[0] || ''}
					{...rest}
				/>
			</div>
		);
	}
);

TextInput.displayName = 'TextInput';

export default TextInput;
