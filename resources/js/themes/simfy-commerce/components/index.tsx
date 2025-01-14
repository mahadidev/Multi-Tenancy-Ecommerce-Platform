import Hero from "./hero";
import Offers from "./offers";
import PromoGrid from "./promoGrid";

const Component = ({ data }: { data: any }) => {
    const components: any = {
        hero: <Hero props={data} />,
        offers: <Offers props={data} />,
        promoGrid: <PromoGrid props={data} />,
    };

    return (
        <>
            {components[data.name]
                ? components[data.name]
                : `Please create the ${data.name} component in react.`}
        </>
    );
};

export default Component;
