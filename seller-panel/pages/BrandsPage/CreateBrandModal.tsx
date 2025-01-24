import useBrand from '@seller-panel/hooks/useBrand';
import useForm from '@seller-panel/hooks/useForm';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';

const CreateBrandModal: FC = function () {
	const [isOpen, setOpen] = useState(false);
	const { create } = useBrand();

	const { handleChange, formState, formErrors } = useForm({
		errors: create.error,
	});

	return (
		<>
			<Button color="blue" className="p-0" onClick={() => setOpen(true)}>
				<div className="flex items-center gap-x-3">
					<HiPlus className="text-xl" />
					Create Brand
				</div>
			</Button>
			<Modal onClose={() => setOpen(false)} show={isOpen}>
				<Modal.Header>Create a new Brand</Modal.Header>
				<Modal.Body>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<div>
								<TextInput
									id="name"
									name="name"
									placeholder="Brand name"
									value={formState['name']}
									color={formErrors['name'] ? 'failure' : 'gray'}
									helperText={
										formErrors['name'] ? formErrors['name'][0] : false
									}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										handleChange(event);
									}}
									required
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="slug">Slug</Label>
							<div>
								<TextInput
									id="slug"
									name="slug"
									placeholder="Brand name"
									value={formState['slug']}
									color={formErrors['slug'] ? 'failure' : 'gray'}
									helperText={
										formErrors['slug'] ? formErrors['slug'][0] : false
									}
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
										handleChange(event);
									}}
									required
								/>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						color="blue"
						onClick={() => {
							create.submit({
								formData: formState,
								onSuccess: () => {
									setOpen(false);
								},
							});
						}}
						isProcessing={create.isLoading}
						disabled={create.isLoading}
						processingLabel="Creating"
						processingSpinner={<AiOutlineLoading />}
					>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default CreateBrandModal;
