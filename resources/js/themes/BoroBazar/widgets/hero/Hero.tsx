import { ThemeWidgetPropsType } from "@type/themeType";
import { Carousel } from "flowbite-react";
import { FC } from "react";

const HeroSection: FC<ThemeWidgetPropsType> = () => {
    return (
        <section className="px-4 lg:px-0">
            <div>
                <div className="!rounded-none h-[500px]">
                    <Carousel
                        className="!rounded-none"
                        slide={true}
                        slideInterval={5}
                        slot="2"
                    >
                        <img
                            src="https://grabit-react-next.maraviyainfotech.com/assets/img/hero-bg/1.jpg"
                            alt="..."
                            className="!rounded-none"
                        />
                        <img
                            src="https://grabit-react-next.maraviyainfotech.com/assets/img/hero-bg/2.jpg"
                            alt="..."
                            className="!rounded-none"
                        />
                    </Carousel>
                </div>
            </div>
        </section>
    );
};
export default HeroSection;
