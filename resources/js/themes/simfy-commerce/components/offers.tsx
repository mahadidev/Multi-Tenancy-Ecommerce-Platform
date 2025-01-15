import { WidgetType } from "@/seller/types";

const Offers = ({ props }: { props: WidgetType }) => {
    return (
        <>
            <section className="py-4 mt-4">
                <div className="container hidden sm:!grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 last:border-r-0 flex-wrap">
                    {props.inputs
                        .find((input) => input.name === "offer_box")
                        ?.items?.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white flex gap-4 px-4 py-6 group"
                            >
                                <span
                                    className="flex items-center text-4xl text-gray-700 group-hover:text-primary transition-all"
                                    dangerouslySetInnerHTML={{
                                        __html: `${
                                            Array.isArray(item) &&
                                            item.find(
                                                (item) => item.name === "icon"
                                            )?.value
                                        }`,
                                    }}
                                ></span>
                                <div className="w-full">
                                    <h1 className="text-lg text-gray-700">
                                        {Array.isArray(item) &&
                                            item.find(
                                                (item) => item.name === "title"
                                            )?.value}
                                    </h1>
                                    <p className="text-gray-600">
                                        {Array.isArray(item) &&
                                            item.find(
                                                (item) =>
                                                    item.name === "description"
                                            )?.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </section>
        </>
    );
};

export default Offers;
