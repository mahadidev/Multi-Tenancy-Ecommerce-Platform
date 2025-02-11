import useForm from "@seller/hooks/useForm";
import useMenu from "@seller/hooks/useMenu";
import { MenuType } from "@type/menuType";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

interface Props {
    menu: MenuType;
}
const EditMenuModal: FC<Props> = ({ menu }) => {
    const [isOpen, setOpen] = useState(false);
    const { update } = useMenu();
    const [items, setItems] = useState<ItemType[]>([]);

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: update.error,
    });

    useEffect(() => {
        if (menu.items) {
            setItems(menu.items);
        }
        setFormState({
            ...menu,
            items: items,
        });
    }, [menu]);
    return (
        <>
            <Button
                color="primary"
                className="p-0"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3">
                    <FiEdit className="text-xl" />
                    Edit Menu
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="4xl">
                <Modal.Header>Edit Menu</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-4">
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
                                    className="p-2.5 rounded-md dark:bg-[#374050] bg-[#F9FAFB] "
                                >
                                    <div className="flex justify-between mb-2 items-center">
                                        <Label className="text-xl">
                                            Item {idx + 1}
                                        </Label>
                                        <Button
                                            size="sm"
                                            color="red"
                                            onClick={() =>
                                                setItems(
                                                    (prevItems: ItemType[]) => {
                                                        const updatedItems = [
                                                            ...prevItems,
                                                        ];
                                                        updatedItems.splice(
                                                            idx,
                                                            1
                                                        );
                                                        return updatedItems;
                                                    }
                                                )
                                            }
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
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
                                                        setItems(
                                                            (prevItems) => {
                                                                const updatedItems =
                                                                    [
                                                                        ...prevItems,
                                                                    ];
                                                                // @ts-ignore
                                                                updatedItems[
                                                                    idx
                                                                ] = {
                                                                    ...updatedItems[
                                                                        idx
                                                                    ],
                                                                    label: event?.target!
                                                                        ?.value,
                                                                };
                                                                return updatedItems;
                                                            }
                                                        );
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <Label htmlFor="href">
                                                Item Href
                                            </Label>
                                            <div>
                                                <TextInput
                                                    id="href"
                                                    name="href"
                                                    placeholder="Href"
                                                    value={item["href"]}
                                                    onChange={(
                                                        event: React.ChangeEvent<HTMLInputElement>
                                                    ) => {
                                                        setItems(
                                                            (prevItems) => {
                                                                const updatedItems =
                                                                    [
                                                                        ...prevItems,
                                                                    ];
                                                                // @ts-ignore
                                                                updatedItems[
                                                                    idx
                                                                ] = {
                                                                    ...updatedItems[
                                                                        idx
                                                                    ],
                                                                    href: event?.target!
                                                                        ?.value,
                                                                };
                                                                return updatedItems;
                                                            }
                                                        );
                                                    }}
                                                    required
                                                />
                                            </div>
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
                            update.submit({
                                formData: { id: menu?.id, ...formState, items },
                                onSuccess: () => {
                                    setOpen(false);
                                },
                            });
                            setFormState({});
                        }}
                        isProcessing={update.isLoading}
                        disabled={update.isLoading}
                        processingLabel="Saving..."
                        processingSpinner={
                            <AiOutlineLoading className="animate-spin" />
                        }
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default EditMenuModal;

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
