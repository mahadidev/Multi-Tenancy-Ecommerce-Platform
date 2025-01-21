import { WidgetType } from "@/seller/types";

export default function Hero({ props }: { props: WidgetType }) {
    console.log(props);
    return (
        <>
            <section className="flex overflow-x-auto">
                {props.inputs
                    .slice()
                    .sort(function (inputA, inputB) {
                        return inputA.id - inputB.id;
                    })
                    .map((input, inputIndex: number) => {
                        if (input.name === "slide" && input.items) {
                            return (
                                <div
                                    className="min-w-full"
                                    key={inputIndex}
                                    style={{
                                        backgroundColor: `${
                                            input.items.find(
                                                (item) =>
                                                    item.name === "bg-color"
                                            )?.value
                                        }`,
                                    }}
                                >
                                    <div className="container mx-auto">
                                        <img
                                            className="min-w-full object-fill"
                                            src={`${
                                                input.items.find(
                                                    (item) =>
                                                        item.name === "image"
                                                )?.value
                                            }
                                `}
                                            alt="Banner"
                                        />
                                    </div>
                                </div>
                            );
                        }
                    })}
            </section>
        </>
    );
}
