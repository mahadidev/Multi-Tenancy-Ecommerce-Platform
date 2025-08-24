import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import { FC } from "react";
import SettingsGeneral from "./SettingsGeneral";
import SettingsProfile from "./SettingsProfile";
import SettingsSocialMedia from "./SettingsSocialMedia";

const SettingsPage: FC = function () {
    return (
        <>
            <PageBreadCrumb title="Settings" items={["Settings"]} />

            <div className="grid grid-cols-1 px-4 xl:grid-cols-3 xl:gap-4">
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
