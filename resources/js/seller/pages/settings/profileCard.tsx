import { ImageInput } from "@/seller/components";
import useForm from "@/seller/hooks/useForm";
import useStore from "@/seller/hooks/useStore";
import { StoreType } from "@/seller/types";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";

const ProfielCard = () => {
    const { store: currentStore, updateStore } = useStore();
    const store: StoreType = currentStore;
    const { handleChange, formState, formErrors } = useForm({
        errors: updateStore.error,
        defaultState: {
            name: store.name,
        },
    });

    return (
        <>
            <Card>
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Name</Label>
                        <div>
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Store name"
                                value={formState["name"]}
                                color={formErrors["name"] ? "failure" : "gray"}
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
                    <div className="flex flex-col gap-2 col-span-full">
                        <Label htmlFor="logo">Logo</Label>
                        <div>
                            <ImageInput
                                id="logo"
                                name="logo"
                                placeholder="click to upload logo"
                                color={formErrors["logo"] ? "failure" : "gray"}
                                helperText={
                                    formErrors["logo"]
                                        ? formErrors["logo"][0]
                                        : false
                                }
                                value={store["logo"]}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    handleChange(event);
                                }}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 col-span-full">
                        <Label htmlFor="dark_logo">Logo Dark</Label>
                        <div>
                            <ImageInput
                                id="dark_logo"
                                name="dark_logo"
                                placeholder="click to upload dark logo"
                                color={
                                    formErrors["dark_logo"] ? "failure" : "gray"
                                }
                                helperText={
                                    formErrors["dark_logo"]
                                        ? formErrors["dark_logo"][0]
                                        : false
                                }
                                value={store["dark_logo"]}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    handleChange(event);
                                }}
                                required
                            />
                        </div>
                    </div>
                    <div className="">
                        <Button
                            color="blue"
                            isProcessing={updateStore.loading}
                            processingLabel="Saving"
                            disabled={updateStore.loading}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                            onClick={() =>
                                updateStore.update({
                                    storeData: formState,
                                })
                            }
                        >
                            Save all
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default ProfielCard;
