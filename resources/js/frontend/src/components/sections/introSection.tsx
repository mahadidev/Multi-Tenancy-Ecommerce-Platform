import SearchBgMobile from "@/frontend/assets/images/search-bg-mobile.jpg";
import SearchBg from "@/frontend/assets/images/search-bg.jpg";

const IntroSection = () => {
    return (
        <>
            <section className="py-16 sm:py-16">
                <div className="container">
                    <div className="relative">
                        <div className="w-full lg:w-[calc(100%-100px)] relative rounded-md sm:rounded-xl overflow-hidden  mx-auto">
                            <img
                                width={1068}
                                height={526}
                                className="hidden md:block"
                                src={SearchBg}
                                alt="Cholo Gori Banner"
                            />

                            <img
                                width={1068}
                                height={526}
                                className="md:hidden"
                                src={SearchBgMobile}
                                alt="Cholo Gori Banner"
                            />

                            <div className=" absolute top-0 left-0 w-full h-full bg-primary/25 flex items-center justify-center">
                                <button className="p-2.5 rounded-full bg-white shadow-md">
                                    <svg
                                        className="w-8 h-8 text-primary"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="lg:absolute top-[90%] lg:top-0 left-0 right-0 w-full lg:w-full h-max lg:h-full mt-7 lg:mt-0 rounded-xl flex  justify-center lg:justify-between items-end lg:items-stretch gap-4 lg:gap-10 lg:py-10 ">
                            <div className="w-full max-w-[220px] h-max p-4 sm:p-5 bg-white rounded-md">
                                <svg
                                    className="w-8 text-primary stroke-primary fill-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill=""
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
                                    />
                                </svg>

                                <h2 className="text-primary mt-2.5 text-base sm:text-lg font-medium ">
                                    E-Commerce Website in One Click
                                </h2>
                                <p className="text-xs text-primary mt-2.5 font-popp">
                                    Get your website just in one click with a
                                    modern vibe look. Easy and full features
                                    customer best experiences.
                                </p>
                            </div>
                            <div className="w-full max-w-[220px] h-max p-4 sm:p-5 bg-white rounded-md mt-auto">
                                <svg
                                    className="w-8 text-primary stroke-primary fill-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill=""
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
                                    />
                                </svg>

                                <h2 className="text-primary mt-2.5 text-base sm:text-lg font-medium ">
                                    E-Commerce Website in One Click
                                </h2>
                                <p className="text-xs text-primary mt-2.5 font-popp">
                                    Get your website just in one click with a
                                    modern vibe look. Easy and full features
                                    customer best experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default IntroSection;
