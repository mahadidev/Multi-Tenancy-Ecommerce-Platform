import { ColorInput, ImageInput } from "@/seller/components";
import usePage from "@/seller/hooks/usePage";
import { WidgetInputItemType, WidgetInputType } from "@/seller/types";
import { Accordion, Button, Label, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

const EditorInput = ({
    input,
    item,
    fieldData,
}: {
    input: WidgetInputType;
    item?: WidgetInputItemType;
    fieldData: WidgetInputType | WidgetInputItemType;
}) => {
    const { onChangeWidgetInput, onChangeWidgetInputItem } = usePage();
    const onChange = (event: React.ChangeEvent<HTMLInputElement | any>) => {
        if (item) {
            onChangeWidgetInputItem({
                event: event,
                input: input,
                item: item,
            });
        } else {
            onChangeWidgetInput({
                event: event,
                input: input,
            });
        }
    };

    return (
        <>
            {fieldData.type !== "textarea" &&
                fieldData.type !== "image" &&
                fieldData.type !== "file" &&
                fieldData.type !== "color" && (
                    <TextInput
                        placeholder={fieldData.placeholder}
                        type={fieldData.type}
                        name={fieldData.name}
                        value={fieldData.value}
                        required={fieldData.required}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            onChange(event);
                        }}
                    />
                )}

            {fieldData.type === "textarea" && (
                <Textarea
                    placeholder={fieldData.placeholder}
                    name={fieldData.name}
                    value={fieldData.value}
                    required={fieldData.required}
                    onChange={(
                        event: React.ChangeEvent<HTMLTextAreaElement>
                    ) => {
                        onChange(event);
                    }}
                    rows={6}
                ></Textarea>
            )}

            {fieldData.type === "image" && (
                <ImageInput
                    placeholder={fieldData.placeholder}
                    type={fieldData.type}
                    name={fieldData.name}
                    value={fieldData.value}
                    valueType="url"
                    required={fieldData.required}
                    onChange={(
                        event: React.ChangeEvent<HTMLTextAreaElement>
                    ) => {
                        onChange(event);
                    }}
                    rows={6}
                />
            )}

            {fieldData.type === "color" && (
                <ColorInput
                    placeholder={fieldData.placeholder}
                    type={fieldData.type}
                    name={fieldData.name}
                    value={fieldData.value}
                    required={fieldData.required}
                    onChange={(
                        event: React.ChangeEvent<HTMLTextAreaElement>
                    ) => {
                        onChange(event);
                    }}
                    rows={6}
                />
            )}
        </>
    );
};

const Input = ({ input }: { input: WidgetInputType }) => {
    return (
        <div className="space-y-2.5 bg-gray-100 dark:bg-gray-900 px-2.5 py-5 rounded-md">
            <Label htmlFor={``}>{input.label}</Label>

            <EditorInput input={input} fieldData={input} />
        </div>
    );
};

const InputItem = ({ input }: { input: WidgetInputType }) => {
    return (
        <>
            <div className="space-y-2.5 bg-gray-100 dark:bg-gray-900 px-2.5 py-5 rounded-md">
                {input.items &&
                    input.items
                        .slice()
                        .sort(function (itemA, itemB) {
                            return itemA.id - itemB.id;
                        })
                        .map((item, itemIndex) => (
                            <div className="space-y-2.5" key={itemIndex}>
                                <Label>{item.label}</Label>

                                <EditorInput
                                    input={input}
                                    item={item}
                                    fieldData={item}
                                />
                            </div>
                        ))}
            </div>
        </>
    );
};

const InputArray = ({ inputs }: { inputs: WidgetInputType[] }) => {
    return (
        <div>
            <Accordion>
                <Accordion.Panel>
                    <Accordion.Title>{inputs[0]?.label}</Accordion.Title>
                    <Accordion.Content>
                        <div className="space-y-2.5">
                            {inputs
                                .sort(function (inputA, inputB) {
                                    return inputA.id - inputB.id;
                                })
                                .map((input, inputIndex) => (
                                    <>
                                        {input.items && (
                                            <InputItem
                                                key={inputIndex}
                                                input={input}
                                            />
                                        )}
                                    </>
                                ))}
                        </div>
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion>
        </div>
    );
};

export default function WidgetEditor() {
    const { widgets, widget, onWidgetReset, saveWidgets } = usePage();
    const [arrayGroup, setArrayGroup] = useState<{
        [key: string]: WidgetInputType[];
    }>();

    useEffect(() => {
        if (widget) {
            setArrayGroup({});
            widgets
                .find((findWidget) => findWidget.id === widget.id)
                ?.inputs.map((input) => {
                    if (input.type === "array") {
                        setArrayGroup((prev) => {
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
    }, [widgets, widget]);

    return (
        <>
            {widget && (
                <div>
                    <div className="flex items-center justify-between gap-2 mb-5">
                        <Button
                            color="primary"
                            onClick={() => saveWidgets.save()}
                        >
                            Save Changes
                        </Button>
                        <Button color="gray" onClick={onWidgetReset}>
                            Reset
                        </Button>
                    </div>

                    <h1 className="p-2.5 rounded-md bg-gray-200 dark:bg-gray-700 dark:text-white text-center font-semibold">
                        Edit{" "}
                        {
                            widgets?.find(
                                (findWidget) => findWidget.id === widget.id
                            )?.label
                        }{" "}
                        widget
                    </h1>

                    <div className="mt-5 space-y-2.5">
                        {widgets
                            .find((findWidget) => findWidget.id === widget.id)
                            ?.inputs.slice()
                            .sort(function (inputA, inputB) {
                                return inputA.id - inputB.id;
                            })
                            .map((input, inputIndex) => (
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
