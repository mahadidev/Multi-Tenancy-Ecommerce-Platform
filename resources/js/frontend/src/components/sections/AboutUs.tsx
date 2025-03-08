import AboutUsImage from "@frontend/assets/images/aboutUs.webp";
import { Card } from "flowbite-react";
import { BsShieldLock } from "react-icons/bs";
import { FaChartLine } from "react-icons/fa";
import { TbDeviceAnalytics, TbDeviceMobileCog } from "react-icons/tb";

const AboutUs = () => {
    return (
        <div className="container mt-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Image Section */}
                <div className="relative w-full">
                    <img
                        src={AboutUsImage}
                        alt="About Us"
                        className="w-full object-cover rounded-xl shadow-lg"
                    />
                </div>

                {/* Content Section */}
                <div>
                    <div className="relative w-max">
                        <h1 className="w-max text-center text-2xl lg:text-5xl text-primary font-medium">
                            Who
                            <span className="relative after:w-full after:h-[4px] after:absolute after:-z-10 after:left-0 after:bottom-2 after:bg-primary-light after:rounded-full">
                                {" "}
                                We
                            </span>{" "}
                            Are
                        </h1>
                    </div>

                    <br />
                    <p className="text-gray-600 mb-4">
                        At <span className="font-semibold">Cholo-gori</span>, we
                        empower businesses and individuals to build, manage, and
                        grow their online presence effortlessly. Our CMS
                        platform is designed to be intuitive, flexible, and
                        scalable.
                        <br />
                        <br />
                        Lorem ipsum dolor sit amet consectetur, adipisicing
                        elit. Vitae, enim ex. Voluptate atque fugit laboriosam
                        corrupti, eveniet consequuntur officiis quidem fuga
                        impedit velit nemo quae ut magnam voluptatibus delectus
                        repudiandae vel aliquam accusamus debitis perferendis
                        dolorum illum voluptatum obcaecati. Sequi voluptas magni
                        quaerat doloribus, porro esse quisquam delectus atque
                        consequuntur in debitis quas veniam hic voluptate
                        officiis.
                    </p>
                </div>
            </div>

            <br />
            <br />
            <br />

            <div>
                <div className="relative w-max mx-auto">
                    <h1 className="w-max text-center text-2xl lg:text-5xl text-primary font-medium">
                        Our
                        <span className="relative after:w-full after:h-[4px] after:absolute after:-z-10 after:left-0 after:bottom-2 after:bg-primary-light after:rounded-full">
                            {" "}
                            Providing
                        </span>{" "}
                        Features
                    </h1>
                </div>
                <br />
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {featuresData.map((feature, index) => (
                        <Card key={index} className="p-3 shadow-sm bg-amber-50">
                            <div className="border border-solid border-slate-300 rounded-full w-[80px] h-[80px] flex justify-center items-center mb-2 text-primary">
                                {feature?.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700">
                                {feature.name}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;

const featuresData = [
    {
        name: "User-Friendly Interface",
        description:
            "No coding required – create and manage websites with ease. From small businesses to enterprises, our platform grows with you.",
        icon: <TbDeviceMobileCog size={35} />,
    },
    {
        name: "Scalability",
        description:
            "From small businesses to enterprises, our platform grows with you. From small businesses to enterprises, our platform grows with you.",
        icon: <FaChartLine size={30} />,
    },
    {
        name: "SEO & Performance Optimization",
        description:
            "Rank higher in search engines and enjoy lightning-fast speeds. From small businesses to enterprises, our platform grows with you.",
        icon: <TbDeviceAnalytics size={35} />,
    },
    {
        name: "Robust Security",
        description:
            "Enterprise-grade security ensures your data stays safe. From small businesses to enterprises, our platform grows with you.",
        icon: <BsShieldLock size={35} />,
    },
];
