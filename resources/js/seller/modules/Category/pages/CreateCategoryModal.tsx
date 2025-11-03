import useForm from "@seller/_hooks/useForm";
import useString from "@seller/_hooks/useString";
import { CategoryType } from "@type/categoryType";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";
import { useCategory } from "../hooks";

const CreateCategoryModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { create, productCategories } = useCategory();
    const { getSlug } = useString();

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
    });

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setOpen(false);
            setIsClosing(false);
            setFormState({});
        }, 300);
    };

    const handleSubmit = () => {
        create.submit({
            formData: {
                ...formState,
                type: 'product' // Explicitly set type to 'product' for product categories
            },
            onSuccess: () => {
                handleClose();
            }
        });
    };

    useEffect(() => {
        if (create.data && isOpen) {
            handleClose();
        }
    }, [create.data]);

    return (
			<>
				<Button color="primary" onClick={() => setOpen(true)}>
					<HiPlus className="mr-2 text-lg" />
					Create Category
				</Button>
				<Modal
					onClose={handleClose}
					show={isOpen}
					className={`transition-all duration-300 ${
						isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
					}`}
				>
					<Modal.Header className="animate-fadeIn">
						Create a Category
					</Modal.Header>
					<Modal.Body className="animate-slideIn">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label htmlFor="name">Name</Label>
								<div>
									<TextInput
										id="name"
										name="name"
										placeholder="Category name"
										value={formState['name']}
										color={formErrors['name'] ? 'failure' : 'gray'}
										helperText={
											formErrors['name'] ? formErrors['name'][0] : false
										}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											handleChange(event);
											setFormState((prev: any) => ({
												...prev,
												slug: getSlug(event.target.value),
											}));
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
										value={formState['slug']}
										color={formErrors['slug'] ? 'failure' : 'gray'}
										placeholder="Category slug"
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
								<Label htmlFor="parent_id">Parent Category</Label>
								<div>
									<Select
										id="parent_id"
										name="parent_id"
										value={formState['parent_id']}
										color={formErrors['parent_id'] ? 'failure' : 'gray'}
										helperText={
											formErrors['parent_id']
												? formErrors['parent_id'][0]
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
										<option value={0}>Select a Parent Category</option>
										{productCategories?.map((category: CategoryType) => (
											<option value={category.id} key={category.id}>
												{category.name}
											</option>
										))}
									</Select>
								</div>
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button
							color="primary"
							onClick={handleSubmit}
							isProcessing={create.isLoading}
							disabled={create.isLoading}
							processingLabel="Creating..."
							processingSpinner={<AiOutlineLoading className="animate-spin" />}
						>
							Create Category
						</Button>
						<Button
							color="gray"
							onClick={handleClose}
							disabled={create.isLoading}
						>
							Cancel
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
};
export default CreateCategoryModal;
