import useStore from "@seller/hooks/useStore";
import { RoutePath } from '@seller/seller_env';
import { Breadcrumb, ToggleSwitch } from "flowbite-react";
import { FC } from "react";
import { HiHome } from "react-icons/hi";
import SettingsGeneral from "./SettingsGeneral";
import SettingsProfile from "./SettingsProfile";
import SettingsSocialMedia from "./SettingsSocialMedia";

const SettingsPage: FC = function () {
    const {store, update} = useStore();

    return (
			<div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 ">
				<div className="col-span-full mb-4 xl:mb-2">
					<Breadcrumb className="mb-5">
						<Breadcrumb.Item href={RoutePath.DashboardPage.index()}>
							<div className="flex items-center gap-x-3">
								<HiHome className="text-xl" />
								<span className="dark:text-white">Dashboard</span>
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
							checked={store?.status === 1 ? true : false}
							id="company-news"
							label={store?.status === 1 ? 'Store active' : 'Store deactive'}
							name="company-news"
							onChange={() =>
								update.submit({
									formData: {
                                        id: store?.id ?? 0,
										status: store?.status === 0 ? 1 : 0,
									},
								})
							}
						/>
					</div>
				</div>
				<div className="col-span-full mb-4 xl:col-auto xl:mb-0">
					<div className="grid grid-cols-1 gap-y-4">
                        <SettingsProfile />
						{/* <ProfielCard />
						<SocialMediaCard />
						<ResetCard /> */}
                        <SettingsSocialMedia />
					</div>
				</div>

				<div className="col-span-2">
					<div className="grid grid-cols-1 gap-y-4">
                        <SettingsGeneral />
					</div>
				</div>
			</div>
		);
};

export default SettingsPage;
