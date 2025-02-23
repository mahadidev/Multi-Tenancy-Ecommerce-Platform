import { ImageCropper } from '@seller/components/ImageCropper/ImageCropper';
import LoadingOverlay from '@seller/components/LoadingOverlay/LoadingOverlay';
import useFile from '@seller/hooks/useFile';
import { FileType } from '@type/fileType';
import { FC, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

interface PropsType {
	files: FileType[];
	selectedFile: FileType | null;
	setSelectedFile: CallableFunction;
	onUploaded: CallableFunction;
}

const GalleryCard: FC<PropsType> = function (props) {
	const { upload } = useFile();
	const [isDoCrop, setDoCrop] = useState<boolean>(false);

	// handle upload file
	const onUploadFileToServer = (
		croppedFile: any,
		alternate_text: string,
		tags: string
	) => {
		upload.submit({
			formData: {
				file: croppedFile,
				type: 'image',
				alternate_text,
				tags,
			},
			onSuccess: (res: any) => {
				props.onUploaded(res);
				setDoCrop(false);
			},
		});
	};
	return (
		<div className="relative">
			<div
				className={`relative ${
					isDoCrop && props?.selectedFile?.url && 'hidden'
				}`}
			>
				<LoadingOverlay isLoading={upload.isLoading} />
				<div
					className={`grid gap-4 ${props.selectedFile?.url && 'grid-cols-3'}`}
				>
					<ResponsiveMasonry
						columnsCountBreakPoints={{ 350: 1, 750: 6, 900: 5 }}
						className="col-span-2 p-4"
					>
						<Masonry columnsCount={3} gutter="10px">
							{props.files?.map((file: FileType, index: number) => (
								<div
									className={`w-full relative `}
									onClick={() => props.setSelectedFile(file)}
									key={index}
								>
									<img
										style={{ width: '100%', display: 'block' }}
										src={file.url}
										key={index}
									/>

									{props.selectedFile?.id === file.id && (
										<div className="absolute w-full h-full top-0 left-0 right-0 bg-gray-900/75 flex justify-center items-center p-5">
											<div className="w-full text-center dark:text-white overflow-hidden ">
												<div className="m-4 flex justify-center items-center">
													<button
														className="underline text-white"
														onClick={() => setDoCrop(true)}
													>
														Edit
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</Masonry>
					</ResponsiveMasonry>

					{props.selectedFile?.url && (
						<div className="bg-gray-200 dark:bg-gray-900/75 p-3.5 space-y-2.5 h-[69vh] overflow-y-auto">
							<div>
								<img src={props.selectedFile.url} />
							</div>

							<h2 className="dark:text-white">{props.selectedFile.name}</h2>

							{props.selectedFile.alternate_text && (
								<p className="dark:text-gray-200">
									{props.selectedFile.alternate_text}
								</p>
							)}

							{props.selectedFile.tags && (
								<p className="dark:text-gray-200">
									{JSON.stringify(props.selectedFile.tags)}
								</p>
							)}

							<a
								className='dark:text-gray-200 block'
								href={props.selectedFile.url}
								target="_blank"
							>
								Copy url
							</a>
						</div>
					)}
				</div>
			</div>
			{isDoCrop && props?.selectedFile?.url && (
				<div className="w-full p-5">
					<ImageCropper
						image={props?.selectedFile?.url}
						onUploadFileToServer={onUploadFileToServer}
						isShowMetaFields={true}
					/>
				</div>
			)}
		</div>
	);
};
export default GalleryCard;
