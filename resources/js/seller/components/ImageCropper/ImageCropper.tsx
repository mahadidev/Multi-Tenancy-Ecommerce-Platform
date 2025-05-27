/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Label, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { Coordinates, Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { AiOutlineLoading } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoReload } from "react-icons/io5";

interface Props {
	image: string;
	onUploadFileToServer: (
		croppedFile: any,
		altText: string,
		tags: string
	) => void;
	isShowMetaFields?: boolean;
	onBackToGallery: CallableFunction;
	meta?: string;
	imageTags?: string[];
	isUploading?: boolean;
}
export const ImageCropper: React.FC<Props> = ({
    image,
    onUploadFileToServer,
    isShowMetaFields = true,
    onBackToGallery,
    meta,
    imageTags,
    isUploading
}) => {
    const cropperRef = useRef<CropperRef>(null);
    const [altText, setAltText] = useState<string>(meta || "");
    const [tags, setTags] = useState<any>(imageTags || "");
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

    // default image size
    const defaultSize = ({
        imageSize,
    }: DefaultSizeType): { width: number; height: number } => {
        return {
            width: imageSize.width,
            height: imageSize.height,
        };
    };

    // upload cropped image
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

    // realtime cropped pixel showing
    const onChange = (cropper: CropperRef) => {
        setCoordinates(cropper.getCoordinates());
    };

    // reset cropping
    const resetCrop = () => {
        if (cropperRef.current) {
            cropperRef.current.reset();
        }
    };
    return (
			<div>
				<div className="pb-4 justify-between flex items-center">
					<button
						onClick={() => onBackToGallery()}
						className="text-gray-700 dark:text-white flex items-center gap-2.5"
					>
						<IoIosArrowRoundBack className="text-2xl" /> Go Back
					</button>
					<button
						onClick={() => resetCrop()}
						className="text-gray-700 dark:text-white flex items-center gap-2.5"
					>
						Reset
						<IoReload className="text-lg" />
					</button>
				</div>
				<div className="w-full grid lg:grid-cols-2 gap-6 relative">
					<div>
						{' '}
						<Cropper
							ref={cropperRef}
							src={image}
							// @ts-ignore
							defaultSize={defaultSize}
							className="max-h-[69dvh]"
							onChange={onChange}
						/>
						<div className="bg-gray-900 text-white text-sm p-2 mt-3 lg:w-[200px] rounded-md">
							<strong>Results:</strong>
							<div>Width: {coordinates?.width || 0} px</div>
							<div>Height: {coordinates?.height || 0} px</div>
							<div>Left: {coordinates?.left || 0}</div>
							<div>Top: {coordinates?.top || 0}</div>
						</div>
					</div>
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
								className="mt-4"
								isProcessing={isUploading}
								disabled={isUploading || !image}
								processingLabel="Uploading"
								processingSpinner={
									<AiOutlineLoading className="animate-spin" />
								}
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
