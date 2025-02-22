import { Button, Card, Label, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { FiUpload } from "react-icons/fi";

interface Props {
    image: string;
    onUploadFileToServer: (
        croppedFile: any,
        altText: string,
        tags: string
    ) => void;
}
export const ImageCropper: React.FC<Props> = ({
    image,
    onUploadFileToServer,
}) => {
    const cropperRef = useRef<CropperRef>(null);
    const [altText, setAltText] = useState<string>("");
    const [tags, setTags] = useState<string>("");

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
                    // console.log({ blob });
                    onUploadFileToServer(blob, altText, tags);
                    // You can upload the blob using FormData if needed.
                }
            });
        }
    };

    return (
        <>
            {image && (
                <Card className="mt-5">
                    <Cropper
                        ref={cropperRef}
                        src={image}
                        // @ts-ignore
                        defaultSize={defaultSize}
                    />
                    <div className="col-span-4 grid grid-cols-1 gap-y-2 sm:col-span-3 my-3">
                        <Label htmlFor="alternate_text">Meta text</Label>

                        <TextInput
                            name="alternate_text"
                            id="alternate_text"
                            placeholder="Meta text for SEO"
                            type="text"
                            value={altText}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setAltText(event.target.value);
                            }}
                        />
                    </div>
                    <div className="col-span-4 grid grid-cols-1 gap-y-2 sm:col-span-3 my-4">
                        <Label htmlFor="alternate_text">Tags</Label>

                        <TextInput
                            name="tags"
                            id="tags"
                            placeholder="Add tags with (,) separator"
                            type="text"
                            value={tags}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setTags(event.target.value);
                            }}
                        />
                    </div>
                    <Button
                        color="primary"
                        onClick={() => onCropUpload()}
                        disabled={!image}
                    >
                        <FiUpload /> &nbsp;&nbsp; Upload
                    </Button>
                </Card>
            )}
        </>
    );
};

interface DefaultSizeType {
    imageSize: { width: number; height: number };
    visibleArea?: { width: number; height: number };
}
