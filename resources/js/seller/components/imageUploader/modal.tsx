import useImageUploader from "@/seller/hooks/useImageUploader";
import { useFetchImagesQuery } from "@/seller/store/reducers/imageApi";
import { FileType } from "@/seller/types";
import { Button, FileInputProps, Modal, TextInput } from "flowbite-react";
import { FC, RefAttributes, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const ImageInput: FC<
    (FileInputProps & RefAttributes<HTMLInputElement>) | any
> = (props) => {
    const [activeTab, setActiveTab] = useState<"upload" | "gallery">("gallery");
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const { data: imagesResponse } = useFetchImagesQuery();
    const [selectedImage, setSelectedImage] = useState<FileType | null>(null);
    const inputRef = useRef(null);
    const [inputProps, setIputProps] = useState<any>(props);

    const onInsertImage = () => {
        if (selectedImage) {
            setIputProps((prev: any) => ({
                ...prev,
                value: selectedImage.location,
            }));

            if (props.onChange) {
                props.onChange({
                    target: {
                        value: selectedImage.location,
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
                                ? "bg-gray-50/75 hover:bg-gray-100/75 dark:bg-gray-700/75 dark:hover:bg-gray-800/75"
                                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 "
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
                                <span className="font-semibold">
                                    {inputProps.placeholder}
                                </span>
                            </p>
                        </div>
                    </label>
                    <div className="w-full h-full top-0 left-0 absolute z-10 overflow-hidden rounded-lg border-2 border-gray-300 border-dashed">
                        <img
                            className="w-full h-full object-cover"
                            src={
                                selectedImage
                                    ? selectedImage.url
                                    : inputProps.value
                            }
                        />
                    </div>
                </div>
            </div>
            <TextInput
                className="hidden"
                {...inputProps}
                onChange={() => console.log("ami to thik achi")}
                ref={inputRef}
            />

            <Modal
                show={isModalOpen}
                onClose={() => setModalOpen(false)}
                size="7xl"
            >
                <Modal.Header className="pb-0 border-b-0">
                    <Button.Group>
                        <Button
                            color="gray"
                            size="lg"
                            onClick={() => setActiveTab("upload")}
                            className={`${
                                activeTab === "upload" && "!bg-gray-700"
                            } rounded-b-none border-b-0 shadow-clear`}
                            style={{
                                boxShadow: "0 0 !important",
                            }}
                        >
                            Upload
                        </Button>
                        <Button
                            size="lg"
                            color="gray"
                            onClick={() => setActiveTab("gallery")}
                            className={`${
                                activeTab === "gallery" && "!bg-gray-700"
                            } rounded-b-none border-b-0  shadow-clear`}
                            style={{
                                boxShadow: "0 0 !important",
                            }}
                        >
                            Gallery
                        </Button>
                    </Button.Group>
                </Modal.Header>
                <Modal.Body className="px-5 py-0">
                    <div className="bg-gray-700 p-4 rounded-lg rounded-tl-none">
                        {activeTab === "gallery" ? (
                            <>
                                {imagesResponse?.data && (
                                    <GalleryCard
                                        selectedImage={selectedImage}
                                        setSelectedImage={setSelectedImage}
                                        images={imagesResponse?.data}
                                    />
                                )}
                            </>
                        ) : (
                            <UploadCard />
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onInsertImage}
                        disabled={!selectedImage}
                        color={selectedImage ? "blue" : "gray"}
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

export default ImageInput;

const GalleryCard = ({
    images,
    selectedImage,
    setSelectedImage,
}: {
    images: FileType[];
    selectedImage: FileType | null;
    setSelectedImage: CallableFunction;
}) => {
    return (
        <div className="">
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 6, 900: 5 }}
            >
                <Masonry columnsCount={3} gutter="10px">
                    {images?.map((image: FileType, index: number) => (
                        <div
                            className={`w-full relative `}
                            onClick={() => setSelectedImage(image)}
                            key={index}
                        >
                            <img
                                style={{ width: "100%", display: "block" }}
                                src={image.url}
                                key={index}
                            />

                            {selectedImage?.id === image.id && (
                                <div className="absolute w-full h-full top-0 left-0 right-0 bg-gray-900/75 flex justify-center items-center p-5">
                                    <div className="w-full text-center dark:text-white overflow-hidden ">
                                        <h2 className="w-max block">
                                            {image.name}
                                        </h2>
                                        <p>
                                            {image.width}px * {image.height}px
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
};

const UploadCard = () => {
    const { uploadImage } = useImageUploader();
    const handleChange = (file: any) => {
        uploadImage({
            formData: {
                file: file,
                type: "image",
                alternate_text: "Brand Logo",
                tags: "Logo,Tags,Brand",
            },
        });
    };

    return (
        <div>
            <FileUploader
                handleChange={handleChange}
                name="file"
                types={["JPG", "PNG", "GIF"]}
            >
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
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
                                <span className="font-semibold">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                        </div>
                    </label>
                </div>
            </FileUploader>
        </div>
    );
};
