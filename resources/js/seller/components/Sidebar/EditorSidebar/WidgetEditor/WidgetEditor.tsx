import useWidget from '@seller/hooks/useWidget';
import { WidgetInputType } from '@type/widgetType';
import { Accordion } from 'flowbite-react';
import { FC, useEffect, useState } from 'react';
import EditorInput from './EditorInput';

const WidgetEditor: FC = () => {
	const { widget } = useWidget();
	const [widgetInputsGroup, setWidgetInputsGroup] = useState<{
		[key: string]: WidgetInputType[];
	}>();

	// group widget inputs
	useEffect(() => {
		if (widget) {
			setWidgetInputsGroup({});
			widget.inputs
				.slice()
				.sort(function (inputA, inputB) {
					return inputA.id - inputB.id;
				})
				.map((input) => {
					if (input.type === 'array') {
						setWidgetInputsGroup((prev) => {
							return {
								...prev,
								[input.name]: [...((prev && prev[input.name]) ?? []), input],
							};
						});
					}
				});
		}
	}, [widget]);

	return (
		<div className="space-y-4">
			<div className="p-2 border-b text-center text-gray-800 dark:text-white">
				Edit {widget?.label}
			</div>

			{/* If input is not array */}
			{widget?.inputs
				.slice()
				.sort(function (inputA, inputB) {
					return inputA.id - inputB.id;
				})
				.map((input, inputIndex) => (
					<div key={inputIndex}>
						{input.type !== 'array' && <EditorInput {...input} />}
					</div>
				))}

			{/* if input type is array */}
			{widgetInputsGroup &&
				Object.keys(widgetInputsGroup).map((key, index) => (
					<>
						{widgetInputsGroup[key] && (
							<div key={index}>
								<Accordion>
									<Accordion.Panel>
										<Accordion.Title>
											{widgetInputsGroup[key][0]?.label}
										</Accordion.Title>
										<Accordion.Content className="space-y-4">
											{widgetInputsGroup[key].map((input) => (
												<div className="dark:bg-gray-800 p-4 rounded-md space-y-4">
													{input.items &&
														input.items
															.slice()
															.sort(function (itemA, itemB) {
																return itemA.id - itemB.id;
															})
															.map((item) => (
																<EditorInput key={item.id} {...item} />
															))}
												</div>
											))}
										</Accordion.Content>
									</Accordion.Panel>
								</Accordion>
							</div>
						)}
					</>
				))}
		</div>
	);
};
export default WidgetEditor;
