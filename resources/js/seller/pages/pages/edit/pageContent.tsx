import usePage from "@/seller/hooks/usePage";
import { ThemeById } from "@/themes/env";
import { Button } from "flowbite-react";

export default function PageContent() {
    const { deleteWidget, store, setWidget, page, widgets } = usePage();

    return (
        <>
            {page && (
                <div className="w-full">
                    {widgets
                        ?.slice()
                        .sort(function (widgetA, widgetB) {
                            return widgetA.id - widgetB.id;
                        })
                        .map((widget: any, index: number) => (
                            <div className="relative" key={index}>
                                <div className="absolute top-0 right-0 flex gap-2.5 items-center pb-4 pl-4 pt-5 pr-5 bg-gray-100  dark:bg-gray-900 text-gray-700 dark:text-white rounded-bl-md shadow-xl">
                                    <Button
                                        color="blue"
                                        onClick={() => setWidget(widget)}
                                        size="xs"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color="red"
                                        onClick={() =>
                                            deleteWidget.delete({
                                                widgetId: widget.id,
                                            })
                                        }
                                        size="xs"
                                    >
                                        Delete
                                    </Button>
                                </div>
                                {ThemeById(store.theme_id).component(widget)}
                            </div>
                        ))}
                </div>
            )}
        </>
    );
}
