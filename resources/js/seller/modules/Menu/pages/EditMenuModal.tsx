import useForm from "@seller/_hooks/useForm";
import useMenu from "@seller/_hooks/useMenu";
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
    const [items, setItems] = useState<ItemType[]>(menu.items || []);

    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: update.error,
    });

    useEffect(() => {
        setFormState({
            ...menu,
            items,
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
                            <Label htmlFor="label">Label</Label>
                            <TextInput
                                id="label"
                                name="label"
                                placeholder="Menu label"
                                value={formState["label"]}
                                color={formErrors["label"] ? "failure" : "gray"}
                                helperText={formErrors["label"]?.[0] || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Menu name"
                                value={formState["name"]}
                                color={formErrors["name"] ? "failure" : "gray"}
                                helperText={formErrors["name"]?.[0] || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="visibility">Visibility</Label>
                            <Select
                                id="visibility"
                                name="visibility"
                                value={formState["visibility"]}
                                color={
                                    formErrors["visibility"]
                                        ? "failure"
                                        : "gray"
                                }
                                helperText={formErrors["visibility"]?.[0] || ""}
                                onChange={handleChange}
                                required
                            >
                                <option value={""}>Select a Visibility</option>
                                {Visibility_Types.map((visibility, idx) => (
                                    <option value={visibility.value} key={idx}>
                                        {visibility.label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div className="col-span-full flex flex-col gap-2.5">
                            <Label>Add new Items</Label>
                            {items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-2.5 rounded-md bg-gray-100 dark:bg-gray-700"
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
                                                    items.filter(
                                                        (_, i) => i !== idx
                                                    )
                                                )
                                            }
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="flex flex-col gap-2.5">
                                            <Label htmlFor="label">Label</Label>
                                            <TextInput
                                                name="label"
                                                placeholder="Item Label"
                                                value={item.label}
                                                color={
                                                    formErrors[
                                                        `items.${idx}.label`
                                                    ]
                                                        ? "failure"
                                                        : "gray"
                                                }
                                                helperText={
                                                    formErrors[
                                                        `items.${idx}.label`
                                                    ]?.[0] || ""
                                                }
                                                onChange={(e) => {
                                                    const updatedItems = [
                                                        ...items,
                                                    ];
                                                    updatedItems[idx] = {
                                                        ...item,
                                                        label: e.target.value,
                                                    };
                                                    setItems(updatedItems);
                                                }}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            <Label htmlFor="href">
                                                Item Href
                                            </Label>
                                            <TextInput
                                                name="href"
                                                placeholder="Href"
                                                value={item.href}
                                                color={
                                                    formErrors[
                                                        `items.${idx}.href`
                                                    ]
                                                        ? "failure"
                                                        : "gray"
                                                }
                                                helperText={
                                                    formErrors[
                                                        `items.${idx}.href`
                                                    ]?.[0] || ""
                                                }
                                                onChange={(e) => {
                                                    const updatedItems = [
                                                        ...items,
                                                    ];
                                                    updatedItems[idx] = {
                                                        ...item,
                                                        href: e.target.value,
                                                    };
                                                    setItems(updatedItems);
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button
                                className="w-full"
                                color="gray"
                                onClick={() =>
                                    setItems([
                                        ...items,
                                        { label: "", href: "" },
                                    ])
                                }
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
                            update.submit({
                                formData: { id: menu.id, ...formState, items },
                                onSuccess: () => {
                                    setOpen(false);
                                    setFormState({});
                                },
                            });
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
    { value: "all", label: "All" },
    { value: "guest", label: "Guest" },
    { value: "user", label: "User" },
];

interface VisibilityType {
    value: string;
    label: string;
}

interface ItemType {
    label: string;
    href: string;
}
