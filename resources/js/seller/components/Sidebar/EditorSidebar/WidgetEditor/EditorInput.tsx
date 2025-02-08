import { ColorInput, FileInput } from '@seller/components';
import useWidget from '@seller/hooks/useWidget';
import { WidgetInputItemType, WidgetInputType } from '@type/widgetType';
import { Label, TextInput } from 'flowbite-react';
import { FC } from 'react';

const EditorInput: FC<WidgetInputType | WidgetInputItemType> = (
	inputOrItem
) => {
	const { onChangeInputOrItem } = useWidget();

	const onChange = (event: React.ChangeEvent<HTMLInputElement | any>) => {
		onChangeInputOrItem({
			event: event,
			inputOrItem: inputOrItem,
		});
	};

	return (
		<div className="flex flex-col gap-1.5">
			<Label
				className="text-sm"
				htmlFor={`${inputOrItem.name}${inputOrItem.id}`}
			>
				{inputOrItem.label}
			</Label>

			{inputOrItem.type !== 'image' &&
				inputOrItem.type !== 'file' &&
				inputOrItem.type !== 'color' &&
				inputOrItem.type !== 'array' && (
					<TextInput
						id={`${inputOrItem.name}${inputOrItem.id}`}
						name={inputOrItem.name}
						placeholder={inputOrItem.placeholder}
						value={inputOrItem.value}
						required={inputOrItem.required}
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

			{inputOrItem.type == 'image' && (
				<FileInput
					{...inputOrItem}
					className="!h-28"
					onChange={onChange}
					valueType={'url'}
					id={`${inputOrItem.name}${inputOrItem.id}`}
					theme={{
						field: {
							input: {
								base: '!py-1 !px-2.5 !rounded-md !w-full !bg-gray-700',
							},
						},
					}}
				/>
			)}

			{inputOrItem.type == 'color' && (
				<ColorInput
					{...inputOrItem}
					onChange={onChange}
					id={`${inputOrItem.name}${inputOrItem.id}`}
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
