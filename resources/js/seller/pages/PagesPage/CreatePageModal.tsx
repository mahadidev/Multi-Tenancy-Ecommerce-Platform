import { ErrorMessage } from '@seller/components';
import FormInput from '@seller/components/FormInput/FormInput';
import useForm from '@seller/hooks/useForm';
import usePage from '@seller/hooks/usePage';
import useTheme from '@seller/hooks/useTheme';
import { PageTypeType } from '@type/pageType';
import { WidgetType } from '@type/widgetType';
import { Button, Label, Modal, Select } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';

const CreatePageModal: FC = function () {
	const [isOpen, setOpen] = useState(false);
	const { create, pageTypes } = usePage();
	const { theme } = useTheme();

	const { handleChange, formState, formErrors, setFormErrors, setFormState } =
		useForm({
			formValidationError: create.error,
		});

	return (
		<>
			<Button color="primary" className="p-0" onClick={() => setOpen(true)}>
				<div className="flex items-center gap-x-3">
					<HiPlus className="text-xl" />
					Create Page
				</div>
			</Button>
			<Modal onClose={() => setOpen(false)} show={isOpen}>
				<Modal.Header>Create a new Page</Modal.Header>
				<Modal.Body>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<FormInput
							id="name"
							label="Name"
							formState={formState}
							formErrors={formErrors}
							handleChange={handleChange}
						/>

						<FormInput
							id="title"
							label="Page title"
							formState={formState}
							formErrors={formErrors}
							handleChange={handleChange}
						/>

						<div className="flex flex-col gap-2">
							<Label htmlFor="page_type_id">Type</Label>
							<div>
								<Select
									id="page_type_id"
									name="page_type_id"
									value={formState['page_type_id']}
									color={formErrors['page_type_id'] ? 'failure' : 'gray'}
									helperText={
										formErrors['page_type_id']
											? formErrors['page_type_id'][0]
											: false
									}
									onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
										if (event.target.value === '0') {
											event.target.value = 'null';
										}
										handleChange(event);
									}}
									required
								>
									<option value={0}>Select page type</option>
									{pageTypes?.map((type: PageTypeType) => (
										<option value={type.id} key={type.id}>
											{type.label}
										</option>
									))}
								</Select>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="layout_id">Layout</Label>
							<div>
								<Select
									id="layout_id"
									name="layout_id"
									value={formState['layout_id']}
									color={formErrors['layout_id'] ? 'failure' : 'gray'}
									helperText={
										formErrors['layout_id'] ? formErrors['layout_id'][0] : false
									}
									onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
										if (event.target.value === '0') {
											event.target.value = 'null';
										}
										handleChange(event);
									}}
									required
								>
									<option value={0}>Select layout</option>
									{theme?.layouts.map((layout: WidgetType) => (
										<option value={layout.id} key={layout.id}>
											{layout.label}
										</option>
									))}
								</Select>
							</div>
						</div>

						<div className="col-span-full">
							{create.error && 'message' in create.error && (
								<ErrorMessage>{create.error.message}</ErrorMessage>
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						color="primary"
						onClick={() => {
							if (formState['layout_id'] === 0) {
								setFormErrors((prev: any) => ({
									...prev,
									layout_id: 'Please select a layout',
								}));
							}

							if (formState['page_type_id'] === 0) {
								setFormErrors((prev: any) => ({
									...prev,
									layout_id: 'Please select a page id',
								}));
							}

							create.submit({
								formData: formState,
								onSuccess: () => {
									setOpen(false);
									setFormState({});
								},
							});
						}}
						isProcessing={create.isLoading}
						disabled={create.isLoading}
						processingLabel="Creating"
						processingSpinner={<AiOutlineLoading className="animate-spin" />}
					>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default CreatePageModal;
