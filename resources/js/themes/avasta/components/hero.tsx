const Hero = ({ props }: { props: any }) => {
    const inputs = JSON.parse(props.inputs);
    return (
        <>
            <section>
                {inputs.carousel.items.map((item: any, index: number) => (
                    <div
                        style={{
                            backgroundColor: `${item["bg-color"].value}`,
                        }}
                        key={index}
                    >
                        <div className="container">
                            <img
                                className="w-full object-fill"
                                src={item["image"].value}
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
