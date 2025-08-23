/* eslint-disable react-hooks/exhaustive-deps */
import useForm from "@seller/_hooks/useForm";
import usePage from "@seller/_hooks/usePage";
import { Label, TextInput } from "flowbite-react";
import { useEffect } from "react";
import PartialEditor from "./PartialEditor";

const PageEditor = () => {
    const { page, savePage, onChangePageInput } = usePage();
    const { formState, formErrors, setFormState } = useForm({
        formValidationError: savePage.error,
        default: {
            ...page,
        },
    });

    useEffect(() => {
        setFormState(page);
    }, [page]);

    return (
			<div className="flex flex-col gap-4 py-2.5">
				<div className="space-y-2">
					<Label htmlFor="title">Page Title</Label>
					<TextInput
						id="title"
						name="title"
						placeholder="Page title"
						value={formState['title']}
						color={formErrors['title'] ? 'failure' : 'gray'}
						helperText={formErrors['title'] ? formErrors['title'][0] : false}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							onChangePageInput(event);
						}}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="slug">Slug</Label>
					<TextInput
						id="slug"
						name="slug"
						placeholder="Page slug"
						value={formState['slug']}
						color={formErrors['slug'] ? 'failure' : 'gray'}
						helperText={formErrors['slug'] ? formErrors['slug'][0] : false}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							onChangePageInput(event);
						}}
						required
					/>
				</div>

                <PartialEditor />
			</div>
		);
};
export default PageEditor;
