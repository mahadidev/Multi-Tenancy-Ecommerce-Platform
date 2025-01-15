import { WidgetType } from "@/seller/types";
import { Accordion, Label, Textarea, TextInput } from "flowbite-react";

export default function WidgetEditor({ widget }: { widget: WidgetType }) {
    return (
        <div>
            <h1 className="p-2.5 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white text-center font-semibold">
                Edit {widget.label} widget
            </h1>

            <div className="mt-5 space-y-2.5">
                {widget.inputs.map((input, index: number) => (
                    <div className="" key={index}>
                        {input.type !== "array" && (
                            <div className="p-2.5 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white space-y-2.5">
                                <Label>{input.label}</Label>
                            </div>
                        )}

                        {input.type === "array" && (
                            <Accordion>
                                <Accordion.Panel>
                                    <Accordion.Title>
                                        {input.label}
                                    </Accordion.Title>
                                    <Accordion.Content>
                                        <div className="space-y-2.5">
                                            {input.items?.map(
                                                (item, itemIndex: number) => (
                                                    <div
                                                        key={itemIndex}
                                                        className="space-y-2.5 bg-gray-100 dark:bg-gray-900 px-2.5 py-5 rounded-md"
                                                    >
                                                        {Array.isArray(item) &&
                                                            item.map(
                                                                (
                                                                    childItem,
                                                                    childIndex: number
                                                                ) => (
                                                                    <div
                                                                        className="space-y-2.5"
                                                                        key={
                                                                            childIndex
                                                                        }
                                                                    >
                                                                        <Label
                                                                            htmlFor={`${itemIndex}${childItem.name}`}
                                                                        >
                                                                            {
                                                                                childItem.label
                                                                            }
                                                                        </Label>

                                                                        {childItem.type !==
                                                                            "textarea" &&
                                                                            childItem.type !==
                                                                                "image" &&
                                                                            childItem.type !==
                                                                                "array" &&
                                                                            childItem.type !==
                                                                                "file" && (
                                                                                <TextInput
                                                                                    id={`${itemIndex}${childItem.name}`}
                                                                                    {...childItem}
                                                                                />
                                                                            )}

                                                                        {childItem.type ===
                                                                            "textarea" && (
                                                                            <Textarea
                                                                                id={`${itemIndex}${childItem.name}`}
                                                                                {...childItem}
                                                                                rows={
                                                                                    5
                                                                                }
                                                                            />
                                                                        )}
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Panel>
                            </Accordion>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
