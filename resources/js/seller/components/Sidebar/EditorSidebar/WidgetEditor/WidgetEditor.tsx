import useWidget from '@seller/_hooks/useWidget';
import { WidgetInputType } from '@type/widgetType';
import { FC, useEffect, useState } from 'react';
import EditorInput from './EditorInput';
import WidgetArrayInput from './WidgetArrayInput';

const WidgetEditor: FC = () => {
	const { widget, widgets } = useWidget();
	const [widgetInputsGroup, setWidgetInputsGroup] = useState<{
		[key: string]: WidgetInputType[];
	}>();

	// group widget inputs
	useEffect(() => {
		setWidgetInputsGroup({});
		if (widget) {
			widgets
				.find((findWidget) => findWidget.id === widget.id)
				?.inputs?.slice()
				.sort(function (inputA, inputB) {
					return inputA.id - inputB.id;
				})
				.map((input) => {
					if (input.type.type === 'array') {
						setWidgetInputsGroup((prev) => {
							return {
								...prev,
								[input.name]: [...((prev && prev[input.name]) ?? []), input],
							};
						});
					}
				});
		}
	}, [widget, widgets]);

	return (
		<div className="space-y-4">
			<div className="p-2 border-b border-gray-500 text-center text-gray-800 dark:text-white">
				{widget ? <>Edit {widget?.label}</> : 'Page Editor'}
			</div>

			{widget && (
				<>
					{/* If input is not array */}
					{widget?.inputs
						?.slice()
						.sort(function (inputA, inputB) {
							return inputA.id - inputB.id;
						})
						.map((input, inputIndex) => (
							<div key={inputIndex}>
								{input.type.type !== 'array' && <EditorInput {...input} />}
							</div>
						))}

					{/* if input type is array */}
					{widgetInputsGroup &&
						Object.keys(widgetInputsGroup).map((key, index) => (
							<>
								{widgetInputsGroup[key] && (
									<WidgetArrayInput
										groupInputs={widgetInputsGroup[key]}
										key={index}
									/>
								)}
							</>
						))}
				</>
			)}
		</div>
	);
};
export default WidgetEditor;
