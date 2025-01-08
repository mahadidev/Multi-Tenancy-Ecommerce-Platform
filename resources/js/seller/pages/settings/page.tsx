// import { useAppDispatch } from "@/seller/store";
import { useFetchSettingsQuery } from "@/seller/store/reducers/settingApi";
// import { setSettings } from "@/seller/store/slices/settingSlice";
import { useEffect } from "react";
// import Basic from "./basic";

const SettingPage = () => {
    const { data: settingsData, isLoading: isSettingsLoading } =
        useFetchSettingsQuery();
    // const dispatch = useAppDispatch();

    useEffect(() => {
        if (settingsData) {
            // dispatch(setSettings());
            console.log(settingsData);
        }
    }, [isSettingsLoading, settingsData]);

    return (
        <>
            <div className="px-4 pt-6">
                <div className="grid xl:grid-cols-2 gap-4">
                    {/* <Basic /> */}
                </div>
                <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"></div>
            </div>
        </>
    );
};

export default SettingPage;
