import useWidget from '@seller/hooks/useWidget';
import { WidgetInputType } from '@type/widgetType';
import { Accordion } from 'flowbite-react';
import { FC } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import EditorInput from './EditorInput';

const WidgetArrayInput: FC<{ groupInputs: WidgetInputType[] }> = ({
	groupInputs,
}) => {
	const { onAddArrayInput, onDeleteArrayInput } = useWidget();

	return (
		<>
			<Accordion>
				<Accordion.Panel>
					<Accordion.Title className="!p-2 !text-sm">
						{groupInputs[0]?.label}
					</Accordion.Title>
					<Accordion.Content className="!p-2 !text-sm flex flex-col gap-4">
						{groupInputs.map((input) => (
							<div className="dark:bg-gray-900 p-4 rounded-md space-y-4 relative">
								<button
									className="!py-1.5 !px-2.5 !rounded-md w-max !bg-gray-700 text-white text-sm absolute top-2.5 right-2.5"
									onClick={() => onDeleteArrayInput({ input: input })}
								>
									<AiFillDelete />
								</button>

								{input.child &&
									input.child
										.slice()
										.sort(function (itemA, itemB) {
											return itemA.id - itemB.id;
										})
										.map((item) => <EditorInput key={item.id} {...item} />)}
							</div>
						))}

						<button
							className="!py-1.5 !px-2.5 !rounded-md !w-full !bg-gray-900 text-white text-sm"
							onClick={() => {
								const input = groupInputs[groupInputs.length - 1];
								if (input) {
									onAddArrayInput({
										input: input,
									});
								}
							}}
						>
							Add new
						</button>
					</Accordion.Content>
				</Accordion.Panel>
			</Accordion>
		</>
	);
};
export default WidgetArrayInput;
