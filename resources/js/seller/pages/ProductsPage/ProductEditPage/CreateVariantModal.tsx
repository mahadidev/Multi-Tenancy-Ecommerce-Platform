import useForm from "@seller/hooks/useForm";
import useProduct from "@seller/hooks/useProduct";
import useString from "@seller/hooks/useString";
import { ProductVariantOptionType } from "@type/productType";
import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiPlus } from "react-icons/hi";

const CreateVariantModal: FC = () => {
    const [isOpen, setOpen] = useState(false);
    const { create, addVariant, product } = useProduct();
    const { handleChange, formState, formErrors, setFormState } = useForm({
        formValidationError: create.error,
    });
    const { getSlug } = useString();
    const [options, setOptions] = useState<ProductVariantOptionType[]>([]);

    const addOption = () => {
        setOptions((prev) => [
            ...prev,
            {
                id: Date.now(),
                label: formState["option_label"],
                qty_stock: formState["option_qty_stock"],
                price: formState["option_price"] ?? product?.price,
                code: null,
                created_at: "",
                updated_at: "",
            },
        ]);
        setFormState({
            ...formState,
            option_label: "",
            option_qty_stock: "",
            option_price: product?.price,
        });
    };

    const removeOption = (label: string) => {
        setOptions((prev) => prev.filter((option) => option.label !== label));
    };

    const handleSubmit = () => {
        addVariant.submit({
            formData: {
                id: Date.now(),
                label: formState["label"],
                slug: getSlug(formState["label"]),
                options: [...options],
                updated_at: "",
                created_at: "",
            },
            onSuccess: () => {
                setOpen(false);
                setFormState({
                    label: "",
                    option_label: "",
                    option_qty_stock: "",
                    option_price: product?.price,
                });
                setOptions([]);
            },
        });
    };

    return (
        <>
            <Button
                color="primary"
                size="xs"
                className="p-2"
                onClick={() => setOpen(true)}
            >
                <div className="flex items-center gap-x-3">
                    <HiPlus className="text-xl" />
                    Create Product Variant
                </div>
            </Button>
            <Modal onClose={() => setOpen(false)} show={isOpen}>
                <Modal.Header>Create a New Variant</Modal.Header>
                <Modal.Body>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col gap-2.5">
                            <TextInput
                                name="label"
                                placeholder="ex. Color"
                                value={formState["label"]}
                                helperText={
                                    formErrors["label"]
                                        ? formErrors["label"][0]
                                        : false
                                }
                                color={formErrors["label"] ? "failure" : "gray"}
                                onChange={(e) => {
                                    handleChange(e);
                                    setFormState((prev: any) => ({
                                        ...prev,
                                        slug: getSlug(e.target.value),
                                    }));
                                }}
                                required
                            />
                        </div>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Option</Table.HeadCell>
                                <Table.HeadCell>Price</Table.HeadCell>
                                <Table.HeadCell>Stock</Table.HeadCell>
                                <Table.HeadCell></Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {options.map((option, idx) => (
                                    <Table.Row
                                        key={idx}
                                        className="dark:bg-[#374050] bg-[#F9FAFB]"
                                    >
                                        <Table.Cell>{option.label}</Table.Cell>
                                        <Table.Cell>{option.price}</Table.Cell>
                                        <Table.Cell>
                                            {option.qty_stock}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                color="red"
                                                size="xs"
                                                onClick={() =>
                                                    removeOption(option.label)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <div className="col-span-full flex flex-col gap-2.5">
                            <Label>Add New Option</Label>
                            <div className="p-2.5 dark:bg-[#374050] bg-[#F9FAFB] rounded-md grid grid-cols-2 gap-2.5">
                                <div className="flex flex-col gap-2.5">
                                    <TextInput
                                        name="option_label"
                                        helperText={
                                            formErrors["option_label"]
                                                ? formErrors["option_label"][0]
                                                : false
                                        }
                                        color={
                                            formErrors["option_label"]
                                                ? "failure"
                                                : "gray"
                                        }
                                        placeholder="Option label"
                                        value={formState["option_label"]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    <TextInput
                                        name="option_price"
                                        placeholder="Option price"
                                        value={
                                            formState["option_price"] ??
                                            product?.price
                                        }
                                        helperText={
                                            formErrors["option_price"]
                                                ? formErrors["option_price"][0]
                                                : false
                                        }
                                        color={
                                            formErrors["option_price"]
                                                ? "failure"
                                                : "gray"
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    <TextInput
                                        name="option_qty_stock"
                                        placeholder="ex. 25"
                                        type="number"
                                        value={formState["option_qty_stock"]}
                                        helperText={
                                            formErrors["option_qty_stock"]
                                                ? formErrors[
                                                      "option_qty_stock"
                                                  ][0]
                                                : false
                                        }
                                        color={
                                            formErrors["option_qty_stock"]
                                                ? "failure"
                                                : "gray"
                                        }
                                        onChange={handleChange}
                                        required
                                    />{" "}
                                </div>
                                <Button
                                    className="w-full"
                                    color="teal"
                                    disabled={
                                        !formState["option_label"] ||
                                        !formState["option_qty_stock"]
                                    }
                                    onClick={addOption}
                                >
                                    Add Option
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="primary"
                        onClick={handleSubmit}
                        isProcessing={create.isLoading}
                        disabled={!formState["label"] || !options.length}
                    >
                        {create.isLoading ? (
                            <AiOutlineLoading className="animate-spin" />
                        ) : (
                            "Create"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreateVariantModal;
