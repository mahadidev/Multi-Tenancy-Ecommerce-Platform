import useForm from "@seller/hooks/useForm";
import useMenu from "@seller/hooks/useMenu";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";

interface VisibilityType {
    value: string;
    label: string;
}

interface ItemType {
    label: string;
    href: string;
}

const Visibility_Types: VisibilityType[] = [
    { value: "all", label: "All" },
    { value: "guest", label: "Guest" },
    { value: "user", label: "User" },
];

const CreateMenuModal: FC = () => {
    const [isOpen, setOpen] = useState(false);
    const { create } = useMenu();
    const [items, setItems] = useState<ItemType[]>([]);
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
    });

    const handleAddItem = () => {
        setItems((prevItems) => [...prevItems, { label: "", href: "" }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems((prevItems) => prevItems.filter((_, idx) => idx !== index));
    };

    const handleItemChange = (
        index: number,
        key: keyof ItemType,
        value: string
    ) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            // @ts-ignore
            updatedItems[index] = { ...updatedItems[index], [key]: value };
            return updatedItems;
        });
    };

    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" /> Create Menu
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="4xl">
                <Modal.Header>Create a new Menu</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-4">
                        {["label", "name"].map((field) => (
                            <div key={field} className="flex flex-col gap-2">
                                <Label htmlFor={field}>
                                    {field.charAt(0).toUpperCase() +
                                        field.slice(1)}
                                </Label>
                                <TextInput
                                    id={field}
                                    name={field}
                                    placeholder={`Menu ${field}`}
                                    value={formState[field] || ""}
                                    color={
                                        formErrors[field] ? "failure" : "gray"
                                    }
                                    helperText={formErrors[field]?.[0] || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="visibility">Visibility</Label>
                            <Select
                                id="visibility"
                                name="visibility"
                                value={formState["visibility"] || ""}
                                color={
                                    formErrors["visibility"]
                                        ? "failure"
                                        : "gray"
                                }
                                helperText={formErrors["visibility"]?.[0] || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a Visibility</option>
                                {Visibility_Types.map(({ value, label }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div className="col-span-full flex flex-col gap-2.5">
                            <Label>Add new Items</Label>
                            {items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-2.5 rounded-md dark:bg-gray-700 bg-gray-100"
                                >
                                    <div className="flex justify-between mb-2 items-center">
                                        <Label className="text-xl">
                                            Item {idx + 1}
                                        </Label>
                                        <Button
                                            size="sm"
                                            color="red"
                                            onClick={() =>
                                                handleRemoveItem(idx)
                                            }
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {["label", "href"].map((key) => (
                                            <div
                                                key={key}
                                                className="flex flex-col gap-2.5"
                                            >
                                                <Label htmlFor={key}>
                                                    {key
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        key.slice(1)}
                                                </Label>
                                                <TextInput
                                                    id={key}
                                                    name={key}
                                                    placeholder={`Item ${key}`}
                                                    value={
                                                        item[
                                                            key as keyof ItemType
                                                        ] || ""
                                                    }
                                                    color={
                                                        formErrors[
                                                            `items.${idx}.${key}`
                                                        ]
                                                            ? "failure"
                                                            : "gray"
                                                    }
                                                    helperText={
                                                        formErrors[
                                                            `items.${idx}.${key}`
                                                        ]?.[0] || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            idx,
                                                            key as keyof ItemType,
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <Button
                                className="w-full"
                                color="gray"
                                onClick={handleAddItem}
                            >
                                Add Item
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={() => {
                            create.submit({
                                formData: { ...formState, items },
                                onSuccess: () => {
                                    setOpen(false);
                                    setFormState({});
                                    setItems([]);
                                },
                            });
                        }}
                        isProcessing={create.isLoading}
                        disabled={create.isLoading}
                        processingLabel="Creating"
                        processingSpinner={
                            <AiOutlineLoading className="animate-spin" />
                        }
                    >
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreateMenuModal;
