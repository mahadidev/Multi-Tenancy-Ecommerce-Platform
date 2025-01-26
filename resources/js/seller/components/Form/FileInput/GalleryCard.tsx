import { FC } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { FileType } from "../@type/fileType";

interface PropsType {
	files: FileType[];
	selectedFile: FileType | null;
	setSelectedFile: CallableFunction;
}

const GalleryCard:FC<PropsType> = function(props){
  return (
		<div>
			<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 6, 900: 5 }}>
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
										<h2 className="w-max block">{file.name}</h2>
										<p>
											{file.width}px * {file.height}px
										</p>
									</div>
								</div>
							)}
						</div>
					))}
				</Masonry>
			</ResponsiveMasonry>
		</div>
	);
}
export default GalleryCard
