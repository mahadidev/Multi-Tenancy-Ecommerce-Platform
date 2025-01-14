const Hero = ({ props }: { props: any }) => {
    const carouselItems = props.inputs?.carousel?.items.slice(0, 1);
    return (
        <>
            <section>
                {carouselItems &&
                    carouselItems?.map((item: any, index: number) => {
                        return (
                            <div
                                style={{
                                    backgroundColor: `${item["bg-color"].value}`,
                                }}
                                key={index}
                            >
                                <div className="container mx-auto">
                                    <img
                                        className="w-full object-fill"
                                        src={item["image"].value}
                                        alt="Banner"
                                    />
                                </div>
                            </div>
                        );
                    })}
            </section>
        </>
    );
};

export default Hero;
