import useForm from "@seller/hooks/useForm";
import useStore from "@seller/hooks/useStore";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { FileInput } from "../../components";


const SettingsProfile = () => {
	const { store, update} = useStore();
	const { handleChange, formState, formErrors } = useForm({
		formValidationError: update.error,
		default: {
			id: store?.id,
			name: store?.name,
		},
	});

	return (
		<>
			<Card>
				<div className="grid grid-cols-1 gap-6">
					<div className="flex flex-col gap-2">
						<Label htmlFor="name">Name</Label>
						<div>
							<TextInput
								id="name"
								name="name"
								placeholder="Store name"
								value={formState['name']}
								color={formErrors['name'] ? 'failure' : 'gray'}
								helperText={formErrors['name'] ? formErrors['name'][0] : false}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
								required
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2 col-span-full">
						<Label htmlFor="logo">Logo</Label>
						<div>
							<FileInput
								id="logo"
								name="logo"
								placeholder="click to upload logo"
								color={formErrors['logo'] ? 'failure' : 'gray'}
								helperText={formErrors['logo'] ? formErrors['logo'][0] : false}
								value={store && store['logo']}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
								required
							/>
						</div>
					</div>
					<div className="flex flex-col gap-2 col-span-full">
						<Label htmlFor="dark_logo">Logo Dark</Label>
						<div>
							<FileInput
								id="dark_logo"
								name="dark_logo"
								placeholder="click to upload dark logo"
								color={formErrors['dark_logo'] ? 'failure' : 'gray'}
								helperText={
									formErrors['dark_logo'] ? formErrors['dark_logo'][0] : false
								}
								value={store && store['dark_logo']}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
								required
							/>
						</div>
					</div>
					<div className="">
						<Button
							color="blue"
							isProcessing={update.isLoading}
							processingLabel="Saving"
							disabled={update.isLoading}
							processingSpinner={
								<AiOutlineLoading className="h-6 w-6 animate-spin" />
							}
							onClick={() =>
								update.submit({
									formData: formState,
								})
							}
						>
							Save all
						</Button>
					</div>
				</div>
			</Card>
		</>
	);
};

export default SettingsProfile;
