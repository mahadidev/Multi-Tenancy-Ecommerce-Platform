import { ColorInput, FileInput } from '@seller/components';
import useWidget from '@seller/hooks/useWidget';
import { WidgetInputItemType, WidgetInputType } from '@type/widgetType';
import { Label, Textarea } from 'flowbite-react';
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
		<div className="space-y-2">
			<Label>{inputOrItem.label}</Label>

			{inputOrItem.type !== 'image' &&
				inputOrItem.type !== 'file' &&
				inputOrItem.type !== 'color' &&
				inputOrItem.type !== 'array' && (
					<Textarea
						name={inputOrItem.name}
						placeholder={inputOrItem.placeholder}
						value={inputOrItem.value}
						required={inputOrItem.required}
						onChange={onChange}
					/>
				)}

			{inputOrItem.type == 'image' && (
				<FileInput
					{...inputOrItem}
					className="!h-28"
					onChange={onChange}
					valueType={'url'}
				/>
			)}

			{inputOrItem.type == 'color' && (
				<ColorInput {...inputOrItem} onChange={onChange} />
			)}
		</div>
	);
};
export default EditorInput;
