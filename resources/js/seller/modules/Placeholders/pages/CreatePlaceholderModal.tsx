import { Button, Modal } from 'flowbite-react';
import { FC, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { HiPlus } from 'react-icons/hi';

const CreatePlaceholderModal: FC = function () {
	const [isOpen, setOpen] = useState(false);
	// const {create} = usePlaceholder();

	// const { handleChange, formState, formErrors } = useForm({
	// 	formValidationError: create.error,
	// });

	return (
		<>
			<Button color="primary" onClick={() => setOpen(true)}>
				<HiPlus className="mr-2 text-lg" />
				Create Placeholder
			</Button>
			<Modal onClose={() => setOpen(false)} show={isOpen}>
				<Modal.Header>Create a new Placeholder</Modal.Header>
				<Modal.Body>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						{/*
                        YOUR_FORM_START_FROM_HERE
                        <div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<div>
								<TextInput
									id="name"
									name="name"
									placeholder="Placeholder name"
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
						</div> */}
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						color="primary"
						// onClick={() => {
						// 	create.submit({
						// 		formData: formState,
						//         onSuccess: () => {
						//             setOpen(false);
						//         }
						// 	})
						// }}
						// isProcessing={create.isLoading}
						// disabled={create.isLoading}
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
export default CreatePlaceholderModal;
