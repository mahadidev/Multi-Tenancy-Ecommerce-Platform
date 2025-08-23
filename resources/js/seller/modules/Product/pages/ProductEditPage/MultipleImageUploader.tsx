import { FileInput } from "@seller/components";
import { Button, Label } from "flowbite-react";
import React from "react";
import { FaPlus } from "react-icons/fa";
// Adjust the imports according to your setup.

type MultipleImageUploaderProps = {
    attachments: string[];
    setAttachments: React.Dispatch<React.SetStateAction<string[]>>;
    gridStyle?: string;
};

const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({
    attachments,
    setAttachments,
    gridStyle = "grid lg:grid-cols-3 xl:grid-cols-4 gap-2",
}) => {
    return (
        <div className="flex flex-col gap-2 col-span-full">
            <Label htmlFor="thumbnail">Images</Label>
            <div className={gridStyle}>
                {attachments?.map((_, idx: number) => (
                    <div key={idx} className="relative">
                        <FileInput
                            id={`attachment-${idx}`}
                            name="attachments"
                            placeholder="Click to upload image"
                            value={attachments[idx]}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setAttachments(
                                    attachments.map((item, i) =>
                                        i === idx ? event?.target?.value : item
                                    )
                                );
                            }}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setAttachments(
                                    attachments.filter((_, i) => i !== idx)
                                );
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded absolute bottom-2 right-2 z-[50]"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="w-[200px]">
                <Button
                    size="sm"
                    color="primary"
                    onClick={() => setAttachments((prev) => [...prev, ""])}
                >
                    <FaPlus /> &nbsp;&nbsp; Add image
                </Button>
            </div>
        </div>
    );
};

export default MultipleImageUploader;
