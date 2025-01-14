const Offers = ({ props }: { props: any }) => {
    const inputs = props.inputs;
    return (
        <>
            <section className="py-4 mt-4">
                <div className="container hidden sm:!grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 last:border-r-0 flex-wrap">
                    {inputs.offer_box.items.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white flex gap-4 px-4 py-6 group"
                        >
                            <span
                                className="flex items-center text-4xl text-gray-700 group-hover:text-primary transition-all"
                                dangerouslySetInnerHTML={{
                                    __html: item["icon"].value,
                                }}
                            ></span>
                            <div className="w-full">
                                <h1 className="text-lg text-gray-700">
                                    {item["title"].value}
                                </h1>
                                <p className="text-gray-600">
                                    {item["description"].value}
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
