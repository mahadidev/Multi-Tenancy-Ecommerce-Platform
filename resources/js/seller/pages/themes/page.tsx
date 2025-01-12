import { RoutePath } from "@/seller/env";
import { useAppSelector } from "@/seller/store";
import { useUpdateStoreMutation } from "@/seller/store/reducers/storeApi";
import { useFetchThemesQuery } from "@/seller/store/reducers/themeApi";
import { Breadcrumb, Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { CiViewBoard } from "react-icons/ci";
import { HiHome } from "react-icons/hi";

export default function ThemePage() {
    const { data: themeResponse } = useFetchThemesQuery();
    const [updateStore, { isLoading: isActiveLoading }] =
        useUpdateStoreMutation();
    const [deactieStore, { isLoading: isDeactvateLoading }] =
        useUpdateStoreMutation();
    const { currentStore } = useAppSelector((state) => state.store);

    const handleActiveTheme = (id: string) => {
        updateStore({
            storeId: currentStore.id,
            formData: {
                theme_id: id,
            },
        });
    };

    const handleDeactive = () => {
        deactieStore({
            storeId: currentStore.id,
            formData: {
                theme_id: "none",
            },
        });
    };

    return (
        <>
            <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
                <div className="col-span-full mb-4 xl:mb-2">
                    <Breadcrumb className="mb-5">
                        <Breadcrumb.Item href={RoutePath.dashboard}>
                            <div className="flex items-center gap-x-3">
                                <HiHome className="text-xl" />
                                <span className="dark:text-white">
                                    Dashboard
                                </span>
                            </div>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Appearance</Breadcrumb.Item>
                        <Breadcrumb.Item>Themes</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="flex justify-between gap-2.5 md:gap-6 flex-wrap ">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Themes
                        </h1>
                    </div>
                </div>
                <div className="col-span-full grid grid-cols-5 gap-x-4 gap-y-6">
                    {themeResponse?.data.themes.map(
                        (item: any, index: number) => (
                            <div
                                key={index}
                                className="mb-4 w-full rounded-lg bg-white p-5 shadow dark:bg-gray-800"
                            >
                                <div className="flex items-center justify-between pb-4">
                                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                                        {item.name}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    {item.thumbnail && (
                                        <div className="relative mb-3 aspect-video w-full">
                                            <img
                                                alt=""
                                                src={item.thumbnail}
                                                className="rounded-lg object-fill"
                                            />
                                        </div>
                                    )}
                                    <div className="pb-4 text-sm font-normal text-gray-700 dark:text-gray-400">
                                        {item.slug}
                                    </div>
                                    <div className="flex justify-between">
                                        {currentStore.theme_id === item.id ? (
                                            <Button
                                                className="w-max"
                                                size="md"
                                                color="gray"
                                                onClick={() => handleDeactive()}
                                                disabled={isDeactvateLoading}
                                                processingLabel="Deactaving"
                                                processingSpinner={
                                                    <AiOutlineLoading />
                                                }
                                                isProcessing={
                                                    isDeactvateLoading
                                                }
                                            >
                                                Deactive
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-max"
                                                size="md"
                                                color="blue"
                                                onClick={() =>
                                                    handleActiveTheme(item.id)
                                                }
                                                disabled={isActiveLoading}
                                                processingLabel="Actaving"
                                                processingSpinner={
                                                    <AiOutlineLoading />
                                                }
                                                isProcessing={isActiveLoading}
                                            >
                                                Active
                                            </Button>
                                        )}
                                        <Button color="light">Preview</Button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}
