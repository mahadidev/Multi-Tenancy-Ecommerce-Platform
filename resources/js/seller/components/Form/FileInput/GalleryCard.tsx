import { ImageCropper } from "@seller/components/ImageCropper/ImageCropper";
import LoadingOverlay from "@seller/components/LoadingOverlay/LoadingOverlay";
import useFile from "@seller/hooks/useFile";
import { FileType } from "@type/fileType";
import { Button, Card } from "flowbite-react";
import { FC, useState } from "react";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

interface PropsType {
    files: FileType[];
    selectedFile: FileType | null;
    setSelectedFile: CallableFunction;
    onUploaded: CallableFunction;
}

const GalleryCard: FC<PropsType> = function (props) {
    const { updateFile } = useFile();
    const [isDoCrop, setDoCrop] = useState<boolean>(false);
    const [copied, setCopied] = useState(false);

    // handle upload file
    const onUploadFileToServer = (
        croppedFile: any,
        alternate_text: string,
        tags: string
    ) => {
        updateFile.submit({
            formData: {
                file: croppedFile,
                type: "image",
                alternate_text,
                tags,
                id: props?.selectedFile?.id,
            },
            onSuccess: (res: any) => {
                props.onUploaded(res);
                setDoCrop(false);
            },
        });
    };

    // handle copy file name
    const handleCopy = () => {
        navigator.clipboard.writeText(props?.selectedFile?.url!);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="relative">
            <div
                className={`relative ${
                    isDoCrop && props?.selectedFile?.url && "hidden"
                }`}
            >
                <LoadingOverlay isLoading={updateFile.isLoading} />
                <div
                    className={`grid gap-4 ${
                        props.selectedFile?.url && "grid-cols-3"
                    }`}
                >
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{ 350: 1, 750: 6, 900: 5 }}
                        className="col-span-2 p-4"
                    >
                        <Masonry columnsCount={3} gutter="10px">
                            {props.files?.map(
                                (file: FileType, index: number) => (
                                    <div
                                        className={`w-full relative `}
                                        onClick={() =>
                                            props.setSelectedFile(file)
                                        }
                                        key={index}
                                    >
                                        <img
                                            style={{
                                                width: "100%",
                                                display: "block",
                                            }}
                                            src={file.url}
                                            key={index}
                                        />

                                        {props.selectedFile?.id === file.id && (
                                            <div className="absolute w-full h-full top-0 left-0 right-0 bg-gray-900/75 flex justify-center items-center p-5">
                                                <div className="w-full text-center dark:text-white overflow-hidden ">
                                                    <div className="m-4 flex justify-center items-center">
                                                        <button
                                                            className="underline text-white"
                                                            onClick={() =>
                                                                setDoCrop(true)
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </Masonry>
                    </ResponsiveMasonry>

                    {props.selectedFile?.url && (
                        <Card className="m-5 max-w-sm mx-auto shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                            <img
                                src={props?.selectedFile?.url}
                                alt={
                                    props?.selectedFile?.alternate_text ||
                                    "Uploaded image"
                                }
                                className="w-full h-48 object-cover"
                            />
                            <div className="py-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                    {props?.selectedFile?.name}
                                </h2>
                                {props?.selectedFile?.alternate_text && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        <strong>Alt Text:</strong>{" "}
                                        {props?.selectedFile?.alternate_text}
                                    </p>
                                )}
                                {props?.selectedFile?.tags && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        <strong>Tags:</strong>{" "}
                                        {props?.selectedFile?.tags}
                                    </p>
                                )}
                                <div className="mt-3 flex items-center justify-between">
                                    <a
                                        href={props?.selectedFile?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                    >
                                        View Image
                                    </a>
                                    <Button
                                        size="sm"
                                        outline
                                        gradientDuoTone="cyanToBlue"
                                        onClick={handleCopy}
                                        className="flex items-center gap-2"
                                    >
                                        <HiOutlineClipboardCopy className="w-5 h-5" />
                                        {copied ? "Copied!" : "Copy URL"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
            {isDoCrop && props?.selectedFile?.url && (
                <div className="w-full p-5">
                    <ImageCropper
                        image={props?.selectedFile?.url}
                        onUploadFileToServer={onUploadFileToServer}
                        isShowMetaFields={true}
                        onBackToGallery={() => {
                            props?.setSelectedFile(null);
                            setDoCrop(false);
                        }}
                        meta={props?.selectedFile?.alternate_text}
                        imageTags={props?.selectedFile?.tags}
                    />
                </div>
            )}
        </div>
    );
};
export default GalleryCard;
