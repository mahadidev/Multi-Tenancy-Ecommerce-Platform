import { RoutePath } from "@/seller/env";
import { useAppSelector } from "@/seller/store";
import { useUpdateStoreMutation } from "@/seller/store/reducers/storeApi";
import { Breadcrumb, ToggleSwitch } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import GeneralCard from "./generalCard";
import ProfielCard from "./profileCard";
import ResetCard from "./resetCard";
import SocialMediaCard from "./socialMediaCard";

const SettingPage = () => {
    const { currentStore: store } = useAppSelector((state) => state.store);
    const [updateStore] = useUpdateStoreMutation();

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
                        <Breadcrumb.Item>Settings</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="flex justify-between gap-2.5 md:gap-6 flex-wrap ">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Store settings
                        </h1>
                        <ToggleSwitch
                            color="blue"
                            sizing="md"
                            checked={store.status}
                            id="company-news"
                            label={
                                store.status === 1
                                    ? "Store active"
                                    : "Store deactive"
                            }
                            name="company-news"
                            onChange={() =>
                                updateStore({
                                    storeId: store.id,
                                    formData: {
                                        status: store.status === 1 ? 0 : 1,
                                    },
                                })
                            }
                        />
                    </div>
                </div>
                <div className="col-span-full mb-4 xl:col-auto xl:mb-0">
                    <div className="grid grid-cols-1 gap-y-4">
                        <ProfielCard />
                        <SocialMediaCard />
                        <ResetCard />
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-y-4">
                        <GeneralCard />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingPage;
