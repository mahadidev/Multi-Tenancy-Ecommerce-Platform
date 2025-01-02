import { Button } from "@/frontend/src/components";
import React from "react";

const HeroSection = () => {
    return (
        <>
            {" "}
            <section className="h-max relative">
                <div className="container py-16 relative z-10">
                    <div className="w-max mx-auto rounded-full px-4 py-[2px] border-[2px] border-primary-light neutral flex items-center justify-between gap-0 mb-7">
                        <div className="flex w-max">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-red-700 relative -left-2 border border-white">
                                <img
                                    className="w-full h-ful object-fill"
                                    src="https://i.pravatar.cc/150?img=70"
                                    alt="Partner"
                                />
                            </div>
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-yellow-700 relative -left-4 border border-white">
                                <img
                                    className="w-full h-ful object-fill"
                                    src="https://i.pravatar.cc/150?img=60"
                                    alt="Partner"
                                />
                            </div>
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-700 relative -left-6 border border-white">
                                <img
                                    className="w-full h-ful object-fill"
                                    src="https://i.pravatar.cc/150?img=52"
                                    alt="Partner"
                                />
                            </div>
                        </div>

                        <p className="text-primary font-semibold text-sm sm:text-base ">
                            Loved by 2.4M users with a 4.8 rating
                        </p>
                    </div>

                    <div className="relative w-max mx-auto">
                        <h1
                            className="w-max text-center text-2xl lg:text-5xl text-primary font-medium lg:leading-[58px]"
                            x-ref="heroText"
                        >
                            From{" "}
                            <span className="relative after:w-full after:h-[4px] after:absolute after:-z-10 after:left-0 after:bottom-2 after:bg-primary-light after:rounded-full">
                                fresh produce
                            </span>{" "}
                            to daily
                            <br />
                            essentials, shop smarter!
                        </h1>
                    </div>

                    <div className="flex gap-2.5 sm:gap-4 items-center w-max mx-auto mt-5 sm:mt-10">
                        <a href="/seller">
                            <Button> Get the app</Button>
                        </a>
                        <Button variant={"white"}>Contact US</Button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;
