import { CheckboxProps, Checkbox as FlowbiteCheckbox } from 'flowbite-react';
import { ChangeEventHandler, ForwardedRef, forwardRef } from 'react';
import Label from '../Label';

interface FormCheckboxProps extends CheckboxProps {
	name: string;
	label?: string;
	formState: any;
	formErrors: any;
	onChange: ChangeEventHandler<HTMLInputElement>;
}

const Checkbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
	({ name, label, formState, formErrors, onChange, ...rest }, ref) => {
		return (
			<div className="w-full flex flex-col gap-1">
				<div className="flex items-center gap-2">
					<FlowbiteCheckbox
						ref={ref}
						id={name}
						name={name}
						checked={!!formState[name]}
						onChange={onChange}
						color={formErrors[name] ? 'failure' : 'gray'}
						{...rest}
					/>
					<Label name={name} label={label} required={rest.required} />
				</div>

				{formErrors[name] && (
					<p className="text-xs text-red-600 mt-0.5">{formErrors[name][0]}</p>
				)}
			</div>
		);
	}
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
