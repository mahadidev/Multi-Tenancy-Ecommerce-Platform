import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPencilAlt } from "react-icons/hi";

interface PropsType {
	// placeholder: PlaceholderType
	placeholder: any
}

const EditPlaceholderModal: FC<PropsType> = function (_props) {
	const [isOpen, setOpen] = useState(false);
	// const {update} = usePlaceholder();
	// const { handleChange, formState, formErrors } = useForm({
	// 	formValidationError: update.error,
	// 	default: {
	// 		...props.placeholder,
	// 	},
	// });

	return (
		<>
			<Button
				size="sm"
				color="blue"
				className="p-0"
				onClick={() => setOpen(true)}
			>
				<div className="flex items-center gap-x-2">
					<HiPencilAlt className="h-5 w-5" />
					Edit Placeholder
				</div>
			</Button>
			<Modal onClose={() => setOpen(false)} show={isOpen}>
				<Modal.Header>Edit Placeholder</Modal.Header>
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
						color="blue"
						// onClick={() => {
						// 	update.submit({
						// 		formData: formState,
						//         onSuccess: () => {
						//             setOpen(false);
						//         }
						// 	})
						// }}
						// isProcessing={update.isLoading}
						// disabled={update.isLoading}
						processingLabel="Saving"
						processingSpinner={<AiOutlineLoading />}
					>
						Save all
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default EditPlaceholderModal
