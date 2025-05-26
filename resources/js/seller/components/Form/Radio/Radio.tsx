import { Radio as RadioFr } from 'flowbite-react';
import { ChangeEventHandler, FC, InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label: string;
	type?: string;
	formState: any;
	formErrors: any;
	onChange: ChangeEventHandler<HTMLInputElement>;
    id: any;
}
const Radio: FC<FormInputProps> = ({
	label,
	formState,
	formErrors,
	id,
	name,
	...rest
}) => {
	return (
		<>
			<div className="full relative">
				<RadioFr
					className="peer hidden"
					id={`option-${id}`}
					{...rest}
					value={formState[name] || ''}
					name={name}
					{...rest}
					color={formErrors[name] ? 'failure' : 'gray'}
				/>
				<label
					htmlFor={`option-${id}`}
					className="relative flex items-center justify-center gap-4 px-2 py-1 overflow-hidden text-gray-500 hover:bg-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:peer-checked:bg-blue-900 dark:peer-checked:border-blue-600 dark:peer-checked:text-blue-300 dark:hover:bg-gray-600"
					key={id}
				>
					{label}
				</label>
			</div>
			{formErrors[name]?.[0] && (
				<p className="text-red-700 mt-1.5">{formErrors[name]?.[0]}</p>
			)}
		</>
	);
};

export default Radio;
