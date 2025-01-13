import useForm from "@/seller/hooks/useForm";
import { useAppSelector } from "@/seller/store";
import { useUpdateStoreMutation } from "@/seller/store/reducers/storeApi";
import { Button, Card } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiCloudUpload } from "react-icons/hi";

const ProfielCard = () => {
    const { currentStore: store } = useAppSelector((state) => state.store);
    const [updateStore, { isLoading, error }] = useUpdateStoreMutation();
    const { handleChange } = useForm({
        errors: error,
    });

    return (
        <>
            <Card>
                <div className="items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4">
                    <img
                        alt=""
                        src={store.logos.primary}
                        className="mb-4 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0 aspect-square object-cover object-center mx-auto md:mx-0 w-[120px]"
                    />
                    <div>
                        <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white text-center md:text-start">
                            {store.name}
                        </h3>
                        <div className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400 text-center md:text-start">
                            Clothing Store
                        </div>

                        <Button
                            className="relative mx-auto md:mx-0"
                            size="sm"
                            color="blue"
                            isProcessing={isLoading}
                            processingLabel="Updating"
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                        >
                            <div className="flex gap-2 items-center">
                                <HiCloudUpload className="mr-2" />
                                Change Logo
                            </div>
                            <input
                                name="logo"
                                type="file"
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleChange(event, (props: any) => {
                                        updateStore({
                                            storeId: store.id,
                                            formData: {
                                                [props.name]: props.value,
                                            },
                                        });
                                    })
                                }
                                className="w-full h-full absolute top-0 left-0 opacity-0 cursor-pointer"
                            />
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default ProfielCard;
