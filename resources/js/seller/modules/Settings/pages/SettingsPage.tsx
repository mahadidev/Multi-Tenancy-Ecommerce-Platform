import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { FC } from "react";
import SettingsGeneral from "./SettingsGeneral";
import SettingsProfile from "./SettingsProfile";
import SettingsSocialMedia from "./SettingsSocialMedia";

const SettingsPage: FC = function () {
    return (
        <>
            <PageBreadCrumb title="Settings" items={["Settings"]} />

            <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4">
                <div className="col-span-full mb-4 xl:mb-2">
                    <div className="flex justify-between gap-2.5 md:gap-6 flex-wrap ">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                            Settings
                        </h1>
                    </div>
                </div>
                
                <div className="col-span-full mb-4 xl:col-auto xl:mb-0">
                    <div className="grid grid-cols-1 gap-y-4">
                        <SettingsProfile />
                        <SettingsSocialMedia />
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="grid grid-cols-1 gap-y-4">
                        <SettingsGeneral />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;