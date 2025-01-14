import { BASE_URL } from "@/env";
import { RoutePath } from "@/seller/env";
import useStore from "@/seller/hooks/useStore";
import { useFetchThemesQuery } from "@/seller/store/reducers/themeApi";
import { Breadcrumb, Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiHome } from "react-icons/hi";

export default function ThemePage() {
    const { data: themeResponse } = useFetchThemesQuery();
    const { activeTheme, deActiveTheme, store } = useStore();

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
                <div className="col-span-full grid grid-cols-4 gap-x-4 gap-y-6">
                    {themeResponse?.data.themes.map(
                        (item: any, index: number) => (
                            <div
                                key={index}
                                className="mb-4 w-full rounded-lg bg-white shadow dark:bg-gray-800"
                            >
                                <div className="flex flex-col">
                                    {item.thumbnail && (
                                        <div className="relative aspect-video w-full">
                                            <img
                                                alt=""
                                                src={item.thumbnail}
                                                className="rounded-lg object-fill"
                                            />
                                        </div>
                                    )}
                                    <div className="px-5 py-2.5 flex justify-between gap-2.5 items-center">
                                        <div className="text-base font-normal text-gray-700 dark:text-gray-400">
                                            {item.name}
                                        </div>
                                        <div className="flex justify-between gap-2.5">
                                            {store.theme_id === item.id ? (
                                                <Button
                                                    className="w-max"
                                                    size="xs"
                                                    color="gray"
                                                    onClick={() =>
                                                        deActiveTheme.deactive()
                                                    }
                                                    disabled={
                                                        deActiveTheme.loading
                                                    }
                                                    processingLabel="Deactaving"
                                                    processingSpinner={
                                                        <AiOutlineLoading />
                                                    }
                                                    isProcessing={
                                                        deActiveTheme.loading
                                                    }
                                                >
                                                    Deactive
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="w-max"
                                                    size="xs"
                                                    color="blue"
                                                    onClick={() =>
                                                        activeTheme.active(
                                                            item.id
                                                        )
                                                    }
                                                    disabled={
                                                        activeTheme.loading
                                                    }
                                                    processingLabel="Actaving"
                                                    processingSpinner={
                                                        <AiOutlineLoading />
                                                    }
                                                    isProcessing={
                                                        activeTheme.loading
                                                    }
                                                >
                                                    Active
                                                </Button>
                                            )}
                                            <Button
                                                href={`${BASE_URL}/themes/${item.slug}`}
                                                target="_blank"
                                                color="light"
                                                size="xs"
                                            >
                                                Preview
                                            </Button>
                                        </div>
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
