import useForm from "@seller/hooks/useForm";
import useMenu from "@seller/hooks/useMenu";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";

const CreateMenuModal: FC = function () {
    const [isOpen, setOpen] = useState(false);
    const { create } = useMenu();
    const [items, setItems] = useState<ItemType[]>([]);

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
    });

    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Create Menu
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a new Menu</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Menu name"
                                    value={formState["name"]}
                                    color={
                                        formErrors["name"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["name"]
                                            ? formErrors["name"][0]
                                            : false
                                    }
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        handleChange(event);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="slug">Label</Label>
                            <div>
                                <TextInput
                                    id="label"
                                    name="label"
                                    placeholder="Menu label"
                                    value={formState["label"]}
                                    color={
                                        formErrors["label"] ? "failure" : "gray"
                                    }
                                    helperText={
                                        formErrors["label"]
                                            ? formErrors["label"][0]
                                            : false
                                    }
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        handleChange(event);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="slug">Visibility</Label>
                            <div>
                                <Select
                                    id="visibility"
                                    name="visibility"
                                    value={formState["visibility"]}
                                    color={
                                        formErrors["visibility"]
                                            ? "failure"
                                            : "gray"
                                    }
                                    helperText={
                                        formErrors["visibility"]
                                            ? formErrors["visibility"][0]
                                            : false
                                    }
                                    onChange={(
                                        event: React.ChangeEvent<HTMLSelectElement>
                                    ) => {
                                        if (event.target.value === "0") {
                                            event.target.value = "null";
                                        }
                                        handleChange(event);
                                    }}
                                    required
                                >
                                    <option value={0}>
                                        Select a Visibility
                                    </option>
                                    {Visibility_Types?.map(
                                        (
                                            visibility: VisibilityType,
                                            idx: number
                                        ) => (
                                            <option
                                                value={visibility?.value}
                                                key={idx}
                                            >
                                                {visibility?.label}
                                            </option>
                                        )
                                    )}
                                </Select>
                            </div>
                        </div>

                        <div className="col-span-full flex flex-col gap-2.5">
                            <Label>Add new Items</Label>
                            {items?.map((item: ItemType, idx: number) => (
                                <div
                                    key={idx}
                                    className="p-2.5 dark:bg-[#374050] bg-[#F9FAFB] rounded-md grid grid-cols-2 gap-2.5"
                                >
                                    <div className="flex flex-col gap-2.5">
                                        <Label htmlFor="label">Label</Label>
                                        <div>
                                            <TextInput
                                                id="label"
                                                name="label"
                                                placeholder="Item Label"
                                                value={item["label"]}
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    setItems((prevItems) => {
                                                        const updatedItems = [
                                                            ...prevItems,
                                                        ];
                                                        // @ts-ignore
                                                        updatedItems[idx] = {
                                                            ...updatedItems[
                                                                idx
                                                            ],
                                                            label: event?.target!
                                                                ?.value,
                                                        };
                                                        return updatedItems;
                                                    });
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                        <Label htmlFor="href">Item Href</Label>
                                        <div>
                                            <TextInput
                                                id="href"
                                                name="href"
                                                placeholder="Href"
                                                value={item["href"]}
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    setItems((prevItems) => {
                                                        const updatedItems = [
                                                            ...prevItems,
                                                        ];
                                                        // @ts-ignore
                                                        updatedItems[idx] = {
                                                            ...updatedItems[
                                                                idx
                                                            ],
                                                            href: event?.target!
                                                                ?.value,
                                                        };
                                                        return updatedItems;
                                                    });
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-2.5 items-end">
                                <Button
                                    className="w-full"
                                    color="gray"
                                    onClick={() => {
                                        setItems((prevItems: ItemType[]) => [
                                            ...prevItems, // spread operator to copy the previous items
                                            { label: "", href: "" }, // add a new item with empty values for label and href
                                        ]);
                                    }}
                                >
                                    Add Item
                                </Button>
                            </div>
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
                                },
                            });
                            setFormState({});
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

export const Visibility_Types: VisibilityType[] = [
    {
        value: "all",
        label: "All",
    },
    {
        value: "guest",
        label: "Guest",
    },
    {
        value: "user",
        label: "User",
    },
];

interface VisibilityType {
    value: string;
    label: string;
}

interface ItemType {
    label: string;
    href: string;
}
