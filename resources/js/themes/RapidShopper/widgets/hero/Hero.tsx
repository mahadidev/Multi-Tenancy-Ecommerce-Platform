import { ThemeWidgetPropsType } from "@type/themeType";
import { Carousel } from "flowbite-react";
import { FC } from "react";

const HeroSection: FC<ThemeWidgetPropsType> = () => {
    return (
        <section className="bg-[#ffc100] h-[500px]">
            <div className="container mx-auto">
                <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
                    <Carousel className="!h-[500px]">
                        <img
                            src="https://i.ibb.co.com/G49PjcrB/carousel1.webp"
                            alt="carousel1"
                            className="!h-[500px]"
                        />
                        <img
                            src="https://i.ibb.co.com/SXRQWs0Q/carousel2.webp"
                            alt="carousel2"
                            className="!h-[500px]"
                        />
                        <img
                            src="https://i.ibb.co.com/G49PjcrB/carousel1.webp"
                            alt="carousel1"
                            className="!h-[500px]"
                        />
                        <img
                            src="https://i.ibb.co.com/SXRQWs0Q/carousel2.webp"
                            alt="carousel2"
                            className="!h-[500px]"
                        />
                    </Carousel>
                </div>
            </div>
        </section>
    );
};
export default HeroSection;
