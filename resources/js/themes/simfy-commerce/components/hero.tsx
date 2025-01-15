import { WidgetType } from "@/seller/types";

const Hero = ({ props }: { props: WidgetType }) => {
    return (
        <>
            <section className="flex overflow-x-auto">
                {props.inputs
                    .find((input) => input.name === "carousel")
                    ?.items?.map((item, index) => (
                        <div
                            className="min-w-full"
                            key={index}
                            style={{
                                backgroundColor: `${
                                    Array.isArray(item) &&
                                    item.find(
                                        (item) => item.name === "bg-color"
                                    )?.value
                                }`,
                            }}
                        >
                            <div className="container mx-auto">
                                <img
                                    className="min-w-full object-fill"
                                    src={`${
                                        Array.isArray(item) &&
                                        item.find(
                                            (item) => item.name === "image"
                                        )?.value
                                    }
                                `}
                                    alt="Banner"
                                />
                            </div>
                        </div>
                    ))}
            </section>
        </>
    );
};

export default Hero;
