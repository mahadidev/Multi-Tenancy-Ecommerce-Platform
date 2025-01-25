import { ColorInput } from "@seller-panel/components";
import useForm from "@seller-panel/hooks/useForm";
import useStore from "@seller-panel/hooks/useStore";
import { Button, Card, Label, Textarea, TextInput } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";


const SettingsGeneral = () => {
	const { store, update } = useStore();
	const { handleChange, formState, formErrors } = useForm({
		formValidationError: update.error,
		default: {
			id: store?.id,
			name: store?.name,
			slug: store?.slug,
			phone: store?.phone,
			description: store?.description,
			email: store?.email,
			location: store?.location,
			primary_color: store?.primary_color,
			secondary_color: store?.secondary_color,
		},
	});


	return (
		<>
			<Card>
				<h3 className="mb-4 text-xl font-bold dark:text-white">
					General information
				</h3>
				<form action="#">
					<div className="grid grid-cols-6 gap-6">
						<div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
							<Label htmlFor="store-name">Store Name</Label>

							<TextInput
								name="name"
								id="store-name"
								placeholder="Store name"
								type="text"
								value={formState['name']}
								color={formErrors['name'] ? 'failure' : 'gray'}
								helperText={formErrors['name'] ? formErrors['name'][0] : false}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
								required
							/>
						</div>
						<div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
							<Label htmlFor="store-slug">Slug</Label>

							<TextInput
								name="slug"
								id="store-slug"
								placeholder="Store slug"
								type="text"
								value={formState['slug']}
								color={formErrors['slug'] ? 'failure' : 'gray'}
								helperText={formErrors['slug'] ? formErrors['slug'][0] : false}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
								required
							/>
						</div>
						<div className="col-span-full grid grid-cols-1 gap-y-2 ">
							<div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
								<Label htmlFor="store-description">Store Name</Label>

								<Textarea
									name="description"
									id="store-description"
									placeholder="Store description"
									value={formState['description']}
									color={formErrors['description'] ? 'failure' : 'gray'}
									helperText={
										formErrors['description']
											? formErrors['description'][0]
											: false
									}
									onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
										handleChange(event);
									}}
									required
								></Textarea>
							</div>
						</div>
						<div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
							<Label htmlFor="store-phone">Phone</Label>

							<TextInput
								name="phone"
								id="store-phone"
								placeholder="Store phone number"
								type="tel"
								value={formState['phone']}
								color={formErrors['phone'] ? 'failure' : 'gray'}
								helperText={
									formErrors['phone'] ? formErrors['phone'][0] : false
								}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
								required
							/>
						</div>
						<div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
							<Label htmlFor="store-email">Email</Label>

							<TextInput
								name="email"
								id="store-email"
								placeholder="Store email address"
								type="email"
								value={formState['email']}
								color={formErrors['email'] ? 'failure' : 'gray'}
								helperText={
									formErrors['email'] ? formErrors['email'][0] : false
								}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
								required
							/>
						</div>
						<div className="col-span-full grid grid-cols-1 gap-y-2 ">
							<Label htmlFor="store-location">Store Address</Label>

							<Textarea
								name="location"
								id="store-location"
								placeholder="Store street address"
								value={formState['location']}
								color={formErrors['location'] ? 'failure' : 'primary'}
								helperText={
									formErrors['location'] ? formErrors['location'][0] : false
								}
								onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
									handleChange(event);
								}}
								required
							></Textarea>
						</div>
						<div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
							<Label htmlFor="store-colorPrimary">Theme Color</Label>

							<ColorInput
								name="primary_color"
								id="store-colorPrimary"
								placeholder=""
								type="color"
								value={formState['primary_color']}
								color={formErrors['primary_color'] ? 'failure' : 'gray'}
								helperText={
									formErrors['primary_color']
										? formErrors['primary_color'][0]
										: false
								}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
								required
							/>
						</div>
						<div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
							<Label htmlFor="store-color-secondary">Secondary Color</Label>

							<ColorInput
								name="secondary_color"
								id="store-color-secondary"
								placeholder=""
								type="color"
								value={formState['secondary_color']}
								color={formErrors['secondary_color'] ? 'failure' : 'gray'}
								helperText={
									formErrors['secondary_color']
										? formErrors['secondary_color'][0]
										: false
								}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									handleChange(event);
								}}
								required
							/>
						</div>
						<div className="col-span-6">
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
				</form>
			</Card>
		</>
	);
};

export default SettingsGeneral;
