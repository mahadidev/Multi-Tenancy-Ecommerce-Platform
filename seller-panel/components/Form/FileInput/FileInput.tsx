import useFile from '@seller-panel/hooks/useFile';
import { FileType } from '@seller-panel/types/fileType';
import { Button, FileInputProps, Modal, TextInput } from 'flowbite-react';
import { FC, RefAttributes, useRef, useState } from 'react';
import GalleryCard from './GalleryCard';
import UploadCard from './UploadCard';

const FileInput: FC<
	| (FileInputProps & RefAttributes<HTMLInputElement> & { valueType?: 'url' })
	| any
> = function (props) {
	const [isModalOpen, setModalOpen] = useState<boolean>(false);
	const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
	const inputRef = useRef(null);
	const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('gallery');
    const [inputProps, setIputProps] = useState<any>(props);

	const { files } = useFile();

	const onInsertFile = () => {
		if (selectedFile) {
			setIputProps((prev: any) => ({
				...prev,
				value:
					props.valueType && props.valueType === 'url'
						? selectedFile.url
						: selectedFile.location,
			}));

			if (props.onChange) {
				props.onChange({
					target: {
						value:
							props.valueType && props.valueType === 'url'
								? selectedFile.url
								: selectedFile.location,
						name: props.name,
					},
				});
			}

			setModalOpen(false);
		}
	};
	return (
		<>
			<div
				onClick={(event: React.MouseEvent<HTMLInputElement>) => {
					event.preventDefault();
					setModalOpen(true);
				}}
			>
				<div className="flex items-center justify-center w-full relative">
					<label
						className={`relative z-20 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${
							inputProps.value
								? 'bg-gray-50/75 hover:bg-gray-100/75 dark:bg-gray-700/75 dark:hover:bg-gray-800/75'
								: 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 '
						}   dark:border-gray-600 dark:hover:border-gray-500`}
					>
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
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
								/>
							</svg>
							<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span className="font-semibold">{inputProps.placeholder}</span>
							</p>
						</div>
					</label>
					<div className="w-full h-full top-0 left-0 absolute z-10 overflow-hidden rounded-lg border-2 border-gray-300 border-dashed">
						<img
							className="w-full h-full object-cover"
							src={selectedFile ? selectedFile.url : inputProps.value}
						/>
					</div>
				</div>
			</div>
			{props.helperText && (
				<p className="mt-2 text-sm text-red-600 dark:text-red-500">
					The slug field is required.
				</p>
			)}

			<TextInput
				className="hidden"
				{...inputProps}
				onChange={() => console.log('ami to thik achi')}
				ref={inputRef}
			/>

			<Modal show={isModalOpen} onClose={() => setModalOpen(false)} size="7xl">
				<Modal.Header className="pb-0 border-b-0">
					<Button.Group>
						<Button
							color="gray"
							size="lg"
							onClick={() => setActiveTab('upload')}
							className={`${
								activeTab === 'upload' && '!bg-gray-700'
							} rounded-b-none border-b-0 shadow-clear`}
							style={{
								boxShadow: '0 0 !important',
							}}
						>
							Upload
						</Button>
						<Button
							size="lg"
							color="gray"
							onClick={() => setActiveTab('gallery')}
							className={`${
								activeTab === 'gallery' && '!bg-gray-700'
							} rounded-b-none border-b-0  shadow-clear`}
							style={{
								boxShadow: '0 0 !important',
							}}
						>
							Gallery
						</Button>
					</Button.Group>
				</Modal.Header>
				<Modal.Body className="px-5 py-0">
					<div className="bg-gray-700 p-4 rounded-lg rounded-tl-none min-h-[69dvh]">
						{activeTab === 'gallery' ? (
							<>
								{files && (
									<GalleryCard
										selectedFile={selectedFile}
										setSelectedFile={setSelectedFile}
										files={files}
									/>
								)}
							</>
						) : (
							<UploadCard
								onUploaded={(uploadedImage: FileType) => {
									setActiveTab('gallery');
									setSelectedFile(uploadedImage);
								}}
							/>
						)}
					</div>
				</Modal.Body>
				<Modal.Footer className="border-t-0">
					<Button
						onClick={onInsertFile}
						disabled={!selectedFile}
						color={selectedFile ? 'blue' : 'gray'}
					>
						Insert
					</Button>
					<Button color="gray" onClick={() => setModalOpen(false)}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default FileInput;
