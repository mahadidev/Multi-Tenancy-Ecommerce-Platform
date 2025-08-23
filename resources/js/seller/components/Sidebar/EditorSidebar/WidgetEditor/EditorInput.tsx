import useWidget from '@seller/_hooks/useWidget';
import { ColorInput, FileInput } from '@seller/components';
import { WidgetInputType } from '@type/widgetType';
import { Label, TextInput } from 'flowbite-react';
import { FC } from 'react';

const EditorInput: FC<WidgetInputType> = (
	input
) => {
	const { onChangeInputOrItem } = useWidget();

	const onChange = (event: React.ChangeEvent<HTMLInputElement | any>) => {
		onChangeInputOrItem({
			event: event,
			input: input,
		});
	};

	return (
		<div className="flex flex-col gap-1.5">
			<Label className="text-sm" htmlFor={`${input.name}${input.id}`}>
				{input.label}
			</Label>

			{input.type.type !== 'image' &&
				input.type.type !== 'file' &&
				input.type.type !== 'color' &&
				input.type.type !== 'array' && (
					<TextInput
						id={`${input.name}${input.id}`}
						name={input.name}
						placeholder={input.placeholder}
						value={input.value}
						required={input.required}
						onChange={onChange}
						theme={{
							field: {
								input: {
									base: '!py-1 !px-2.5 !rounded-md !w-full !bg-gray-700',
								},
							},
						}}
					/>
				)}

			{input.type.type == 'image' && (
				<FileInput
					{...input}
					className="!h-28"
					onChange={onChange}
					valueType={'url'}
					id={`${input.name}${input.id}`}
					theme={{
						field: {
							input: {
								base: '!py-1 !px-2.5 !rounded-md !w-full !bg-gray-700',
							},
						},
					}}
				/>
			)}

			{input.type.type == 'color' && (
				<ColorInput
					{...input}
					onChange={onChange}
					id={`${input.name}${input.id}`}
					theme={{
						field: {
							input: {
								base: '!py-1 !px-2.5 !rounded-md !w-full !bg-gray-700',
							},
						},
					}}
				/>
			)}
		</div>
	);
};
export default EditorInput;
