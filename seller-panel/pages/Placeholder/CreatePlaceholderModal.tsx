import { FileInput } from '@seller-panel/components';
import { useForm } from '@seller-panel/hooks';
import useBrand from '@seller-panel/hooks/useBrand';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';

const CreateModal: FC = function () {
	const [isOpen, setOpen] = useState(false);
	const {create} = useBrand();

	const { handleChange, formState, formErrors } = useForm({
		errors: create.error,
	});

	return (
		<>
			<Button color="blue" className="p-0" onClick={() => setOpen(true)}>
				<div className="flex items-center gap-x-3">
					<HiPlus className="text-xl" />
					Create brand
				</div>
			</Button>
			<Modal onClose={() => setOpen(false)} show={isOpen}>
				<Modal.Header>Create a new brand</Modal.Header>
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
									placeholder="Brand Slug"
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
						<div className="flex flex-col gap-2">
							<Label htmlFor="image">Image</Label>
							<div>
								<FileInput
									id="image"
									name="image"
									placeholder="click to upload image"
									color={formErrors['image'] ? 'failure' : 'gray'}
									helperText={
										formErrors['image'] ? formErrors['image'][0] : false
									}
									value={formState['image']}
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
                                }
							})
						}}
						isProcessing={create.isLoading}
						processingLabel="Creating"
						processingSpinner={<AiOutlineLoading />}
						disabled={create.isLoading}
					>
						Create
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default CreateModal;
