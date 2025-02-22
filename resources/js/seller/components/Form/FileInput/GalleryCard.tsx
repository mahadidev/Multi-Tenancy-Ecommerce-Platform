import { ImageCropper } from "@seller/components/ImageCropper/ImageCropper";
import LoadingOverlay from "@seller/components/LoadingOverlay/LoadingOverlay";
import useFile from "@seller/hooks/useFile";
import { FileType } from "@type/fileType";
import { Button, Modal } from "flowbite-react";
import { FC, useState } from "react";
import { MdOutlineCrop } from "react-icons/md";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

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
                type: "image",
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
            {" "}
            <LoadingOverlay isLoading={upload.isLoading} />
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 6, 900: 5 }}
            >
                <Masonry columnsCount={3} gutter="10px">
                    {props.files?.map((file: FileType, index: number) => (
                        <div
                            className={`w-full relative `}
                            onClick={() => props.setSelectedFile(file)}
                            key={index}
                        >
                            <img
                                style={{ width: "100%", display: "block" }}
                                src={file.url}
                                key={index}
                            />

                            {props.selectedFile?.id === file.id && (
                                <div className="absolute w-full h-full top-0 left-0 right-0 bg-gray-900/75 flex justify-center items-center p-5">
                                    <div className="w-full text-center dark:text-white overflow-hidden ">
                                        <h2 className="w-max block">
                                            {file.name}
                                        </h2>
                                        <p>
                                            {file.width}px * {file.height}px
                                        </p>
                                        <div className="m-4 flex justify-center items-center">
                                            <Button
                                                color="primary"
                                                onClick={() => setDoCrop(true)}
                                            >
                                                <MdOutlineCrop />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
            <Modal show={isDoCrop} onClose={() => setDoCrop(false)} size="4xl">
                <Modal.Header className="pb-0 border-b-0">
                    Crop Image
                </Modal.Header>
                <Modal.Body className="px-5 py-0 flex justify-center items-center">
                    {isDoCrop && (
                        <div className="sm:w-7/12">
                            <ImageCropper
                                image={props?.selectedFile?.url!}
                                onUploadFileToServer={onUploadFileToServer}
                                isShowMetaFields={false}
                            />
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default GalleryCard;
