import { FileInput } from '@seller/components';
import { Label } from 'flowbite-react';
import MultipleImageUploader from '../MultipleImageUploader';
import { SectionProps } from '../ProductEditPage';

const MediaSection = ({
	formState,
	formErrors,
	handleChange,
	product,
	attachments,
	setAttachments,
}: SectionProps) => {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full">
			<div className="flex flex-col gap-2">
				<Label htmlFor="thumbnail">Thumbnail</Label>
				<FileInput
					id="thumbnail"
					name="thumbnail"
					placeholder="Upload thumbnail"
					value={formState['thumbnail'] ?? product?.thumbnail}
					color={formErrors['thumbnail'] ? 'failure' : 'gray'}
					helperText={
						formErrors['thumbnail'] ? formErrors['thumbnail'][0] : false
					}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(event);
					}}
				/>
			</div>

			<div className="col-span-full">
				<MultipleImageUploader
					attachments={attachments}
					setAttachments={setAttachments}
				/>
			</div>
		</div>
	);
};

export default MediaSection;
