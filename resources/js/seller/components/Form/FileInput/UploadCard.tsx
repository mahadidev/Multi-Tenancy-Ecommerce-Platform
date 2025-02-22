import { ImageCropper } from "@seller/components/ImageCropper/ImageCropper";
import LoadingOverlay from "@seller/components/LoadingOverlay/LoadingOverlay";
import { FC, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import useFile from "../../../hooks/useFile";
import ErrorMessage from "../../Error/ErrorMessage";

interface PropsType {
    onUploaded: CallableFunction;
}

const UploadCard: FC<PropsType> = function (props) {
    const { upload } = useFile();
    const [image, setImage] = useState<string>();

    // handle image selection
    const handleChangeFile = (file: File) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    // handle upload file
    const onUploadFileToServer = (
        croppedFile: any,
        alternate_text: string,
        tags: string
    ) => {
        upload.submit({
            formData: {
                file: croppedFile,
                type: "image",
                alternate_text,
                tags,
            },
            onSuccess: props.onUploaded,
        });
    };
    return (
			<div className="relative p-5">
				<div className={` ${image && 'hidden'} relative`}>
					<LoadingOverlay isLoading={upload.isLoading} />
					<FileUploader
						handleChange={handleChangeFile}
						name="file"
						types={['JPG', 'PNG', 'GIF']}
					>
						<div className="flex items-center justify-center w-full">
							<label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 ">
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<svg
										className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 20 16"
									>
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
										/>
									</svg>
									<>
										{upload.isLoading ? (
											<>
												<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
													<span className="font-semibold">Uploading</span>{' '}
													please wait.
												</p>
											</>
										) : (
											<>
												<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
													<span className="font-semibold">Click to upload</span>{' '}
													or drag and drop
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													SVG, PNG, JPG or GIF (MAX. 800x400px)
												</p>
											</>
										)}
									</>
								</div>
							</label>
						</div>
					</FileUploader>
				</div>

				{image && (
					<div className="w-full">
						<ImageCropper
							image={image!}
							onUploadFileToServer={onUploadFileToServer}
						/>
					</div>
				)}

				{upload.error && 'message' in upload.error && (
					<ErrorMessage>{upload.error.message}</ErrorMessage>
				)}
			</div>
		);
};
export default UploadCard;
