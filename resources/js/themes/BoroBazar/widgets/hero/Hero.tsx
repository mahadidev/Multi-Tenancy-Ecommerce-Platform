import { ThemeWidgetPropsType } from "@type/themeType";
import { Carousel } from "flowbite-react";
import { FC } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";

const HeroSection: FC<ThemeWidgetPropsType> = ({ widget }) => {
    return (
        <section>
            <div className="!rounded-none h-[600px]">
                <Carousel
                    leftControl={
                        <button className="p-2 rounded-full shadow-lg bg-white hover:bg-[#4cb49f] hover:text-white hover:duration-300">
                            <AiOutlineArrowLeft size={22} />
                        </button>
                    }
                    rightControl={
                        <button className="p-2 rounded-full shadow-lg bg-white hover:bg-[#4cb49f] hover:text-white hover:duration-300">
                            <AiOutlineArrowRight size={22} />
                        </button>
                    }
                >
                    {widget?.inputs?.map((slider) => {
                        const tagline = slider?.child?.find(
                            (item) => item.name === "tagline"
                        )?.value;
                        const title = slider?.child?.find(
                            (item) => item.name === "title"
                        )?.value;
                        const btnText = slider?.child?.find(
                            (item) => item.name === "btnText"
                        )?.value;
                        const sliderImage = slider?.child?.find(
                            (item) => item.name === "sliderImage"
                        )?.value;
                        return (
                            <div
                                key={slider.id}
                                className="h-[600px] bg-no-repeat bg-cover flex items-center px-4 lg:px-0"
                                style={{
                                    backgroundImage: `url(${sliderImage})`,
                                }}
                            >
                                <div className="container mx-auto">
                                    <div className="w-[530px]">
                                        <p className="mb-5 text-[22px] text-[#5caf90] leading-none tracking-normal font-medium">
                                            {tagline}
                                        </p>
                                        <h1 className="mb-7 text-[55px] leading-[68px] text-[#4b5966] tracking-wide font-bold relative">
                                            {title}
                                        </h1>
                                        <button className="bg-[#02B290] hover:bg-[#4cb49f] text-white px-5 py-2 rounded-sm flex items-center">
                                            {btnText} &nbsp;&nbsp;{" "}
                                            <FaArrowRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </Carousel>
            </div>
        </section>
    );
};
export default HeroSection;
