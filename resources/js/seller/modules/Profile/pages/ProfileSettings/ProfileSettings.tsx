import { PageBreadCrumb } from "@seller/components/PageHeader/PageBreadcrumb";
import React from "react";
import GeneralSettings from "./GeneralSettings";
import PasswordResetForm from "./PasswordResetForm";

const ProfileSettingsPage: React.FC = () => {
    return (
        <div>
            <PageBreadCrumb
                title="Seller profile settings"
                items={["My Account", "Profile Settings"]}
            />

            <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-2 gap-y-4 xl:gap-4">
                {/* seller profile settings */}
                <GeneralSettings />

                {/* seller account password changing */}
                <PasswordResetForm />
            </div>
        </div>
    );
};

export default ProfileSettingsPage;
