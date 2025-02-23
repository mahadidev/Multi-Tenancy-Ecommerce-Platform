/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Label, TextInput } from 'flowbite-react';
import { useRef, useState } from 'react';
import { Cropper, CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { FiUpload } from 'react-icons/fi';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoReload } from 'react-icons/io5';

interface Props {
	image: string;
	onUploadFileToServer: (
		croppedFile: any,
		altText: string,
		tags: string
	) => void;
	isShowMetaFields?: boolean;
}
export const ImageCropper: React.FC<Props> = ({
	image,
	onUploadFileToServer,
	isShowMetaFields = true,
}) => {
	const cropperRef = useRef<CropperRef>(null);
	const [altText, setAltText] = useState<string>('');
	const [tags, setTags] = useState<string>('');

	const defaultSize = ({
		imageSize,
	}: DefaultSizeType): { width: number; height: number } => {
		return {
			width: imageSize.width,
			height: imageSize.height,
		};
	};

	const onCropUpload = () => {
		const canvas = cropperRef.current?.getCanvas();
		if (canvas) {
			canvas.toBlob((blob) => {
				if (blob) {
					onUploadFileToServer(blob, altText, tags);
				}
			});
		}
	};

	return (
		<div>
			<div className="pb-4 justify-between flex items-center">
				<button className="text-gray-700 dark:text-white flex items-center gap-2.5">
					<IoIosArrowRoundBack className="text-2xl" /> Back to gallery
				</button>
				<button className="text-gray-700 dark:text-white flex items-center gap-2.5">
					Reset
					<IoReload className="text-lg" />
				</button>
			</div>
			<div className="w-full grid grid-cols-2 gap-6">
				<Cropper
					ref={cropperRef}
					src={image}
					// @ts-ignore
					defaultSize={defaultSize}
					className="max-h-[69dvh]"
				/>
				{isShowMetaFields && (
					<div className="py-2.5 space-y-3.5">
						<div className="space-y-1.5">
							<Label htmlFor="alternate_text">Meta text</Label>

							<TextInput
								color="light"
								name="alternate_text"
								id="alternate_text"
								placeholder="Meta text for SEO"
								type="text"
								value={altText}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setAltText(event.target.value);
								}}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="alternate_text">Tags</Label>

							<TextInput
								color="light"
								name="tags"
								id="tags"
								placeholder="Add tags with (,) separator"
								type="text"
								value={tags}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setTags(event.target.value);
								}}
							/>
						</div>

						<Button
							color="primary"
							onClick={() => onCropUpload()}
							disabled={!image}
							className="mt-4"
						>
							<FiUpload /> &nbsp;&nbsp; Upload
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

interface DefaultSizeType {
	imageSize: { width: number; height: number };
	visibleArea?: { width: number; height: number };
}
