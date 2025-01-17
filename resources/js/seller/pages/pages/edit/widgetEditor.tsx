import usePage from "@/seller/hooks/usePage";
import { WidgetInputType } from "@/seller/types";
import { Accordion, Label, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

const Input = ({ input }: { input: WidgetInputType }) => {
    const { setSelected, onChangePageInput } = usePage();
    return (
        <div className="space-y-2.5 bg-gray-100 dark:bg-gray-900 px-2.5 py-5 rounded-md">
            <Label htmlFor={``}>{input.label}</Label>
            <TextInput
                placeholder={input.placeholder}
                type={input.type}
                name={input.name}
                value={input.value}
                required={input.required}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSelected({
                        input: input,
                    });
                    onChangePageInput({
                        selected: {
                            input: input,
                        },
                        type: "input",
                        target: event.target,
                    });
                }}
            />
        </div>
    );
};

const InputArray = ({ inputs }: { inputs: WidgetInputType[] }) => {
    const { setSelected, onChangePageInput } = usePage();
    return (
        <div>
            <Accordion>
                <Accordion.Panel>
                    <Accordion.Title>{inputs[0]?.label}</Accordion.Title>
                    <Accordion.Content>
                        <div className="space-y-2.5">
                            {inputs.map((input, inputIndex) => (
                                <div key={inputIndex}>
                                    <div className="space-y-2.5 bg-gray-100 dark:bg-gray-900 px-2.5 py-5 rounded-md">
                                        {input.items?.map((item, itemIndex) => (
                                            <div
                                                className="space-y-2.5"
                                                key={itemIndex}
                                            >
                                                <Label>{item.label}</Label>

                                                {item.type !== "textarea" &&
                                                    item.type !== "image" &&
                                                    item.type !== "file" && (
                                                        <TextInput
                                                            placeholder={
                                                                item.placeholder
                                                            }
                                                            type={item.type}
                                                            name={item.name}
                                                            value={item.value}
                                                            required={
                                                                item.required
                                                            }
                                                            onChange={(
                                                                event: React.ChangeEvent<HTMLInputElement>
                                                            ) => {
                                                                onChangePageInput(
                                                                    {
                                                                        selected:
                                                                            {
                                                                                input: input,
                                                                                item: item,
                                                                            },
                                                                        type: "item",
                                                                        target: event.target,
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    )}

                                                {item.type === "textarea" && (
                                                    <Textarea
                                                        placeholder={
                                                            item.placeholder
                                                        }
                                                        name={item.name}
                                                        value={item.value}
                                                        required={item.required}
                                                        onChange={(
                                                            event: React.ChangeEvent<HTMLTextAreaElement>
                                                        ) => {
                                                            onChangePageInput({
                                                                selected: {
                                                                    input: input,
                                                                    item: item,
                                                                },
                                                                type: "item",
                                                                target: event.target,
                                                            });
                                                        }}
                                                        rows={6}
                                                    ></Textarea>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion>
        </div>
    );
};

export default function WidgetEditor() {
    const { onChangePageInput, setSelected, widget, page } = usePage();
    const [arrayGroup, setArrayGroup] = useState<{
        [key: string]: WidgetInputType[];
    }>();

    useEffect(() => {
        if (page && widget) {
            setArrayGroup({});
            page.widgets
                .find((findWidget) => findWidget.id === widget.id)
                ?.inputs.map((input) => {
                    if (input.type === "array") {
                        setArrayGroup((prev) => {
                            console.log({
                                ...prev,
                                [input.name]: [
                                    ...((prev && prev[input.name]) ?? []),
                                    input,
                                ],
                            });
                            return {
                                ...prev,
                                [input.name]: [
                                    ...((prev && prev[input.name]) ?? []),
                                    input,
                                ],
                            };
                        });
                    }
                });
        }
    }, [page]);

    return (
        <>
            {page && widget && (
                <div>
                    <h1 className="p-2.5 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white text-center font-semibold">
                        Edit{" "}
                        {
                            page.widgets.find(
                                (findWidget) => findWidget.id === widget.id
                            )?.label
                        }{" "}
                        widget
                    </h1>

                    <div className="mt-5 space-y-2.5">
                        {page.widgets
                            .find((findWidget) => findWidget.id === widget.id)
                            ?.inputs.map((input, inputIndex) => (
                                <div key={inputIndex}>
                                    {input.type !== "array" && (
                                        <Input input={input} />
                                    )}
                                </div>
                            ))}

                        {arrayGroup &&
                            Object.keys(arrayGroup).map((key, index) => (
                                <>
                                    {arrayGroup[key] && (
                                        <div key={index}>
                                            <InputArray
                                                inputs={arrayGroup[key]}
                                            />
                                        </div>
                                    )}
                                </>
                            ))}
                    </div>
                </div>
            )}
        </>
    );
}
