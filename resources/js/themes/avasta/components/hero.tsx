const Hero = ({ props }: { props: any }) => {
    console.log(props);
    return (
        <section
            style={{
                backgroundColor: `${
                    JSON.parse(props.inputs.banner_color).value
                }`,
            }}
        >
            <div className="container">
                <img src={JSON.parse(props.inputs.banner).value} />
            </div>
        </section>
    );
};

export default Hero;
