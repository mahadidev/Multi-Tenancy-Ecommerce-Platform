const PromoGrid = ({ props }: { props: any }) => {
    const inputs = JSON.parse(props.inputs);
    return (
        <>
            <section className="py-4">
                <div className="container grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-5">
                    {inputs.gridItems.items.map((item: any, index: number) => (
                        <div className="group overflow-hidden">
                            <img
                                alt="Promo Banner"
                                className="w-full group-hover:scale-105 transition-all"
                                loading="lazy"
                                src={item.image.value}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default PromoGrid;
