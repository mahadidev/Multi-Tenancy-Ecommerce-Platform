import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";

const OffersSection: FC<ThemeWidgetPropsType> = ({ widget }) => {
    return (
        <section className="py-4 my-5">
            <div className="container mx-auto">
                {/* Offer Grid Box */}
                {widget.inputs.find((input) => input.name === "features") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                        {widget.inputs
                            .filter((input) => input.name === "features")
                            .map((input, index) => (
                                <div
                                    key={index}
                                    className="p-6 text-center border rounded-lg"
                                >
                                    <div className="mb-4 flex justify-center">
                                        <img
                                            src={
                                                input.child?.find(
                                                    (childItem) =>
                                                        childItem.name ===
                                                        "icon"
                                                )?.value
                                            }
                                            alt="icon"
                                            width={60}
                                            height={60}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        {
                                            input.child?.find(
                                                (childItem) =>
                                                    childItem.name === "title"
                                            )?.value
                                        }
                                    </h3>
                                    <p className="text-gray-600">
                                        {
                                            input.child?.find(
                                                (childItem) =>
                                                    childItem.name ===
                                                    "description"
                                            )?.value
                                        }
                                    </p>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </section>
    );
};
export default OffersSection;

// const services = [
//     {
//         icon: <FaTruckMoving className="text-4xl text-blue-600" />,
//         title: "Free Shipping",
//         description: "Free shipping on all US orders or orders above $200",
//     },
//     {
//         icon: <FaHandHoldingHeart className="text-4xl text-green-600" />,
//         title: "24X7 Support",
//         description: "Contact us 24 hours a day, 7 days a week",
//     },
//     {
//         icon: <FaPercent className="text-4xl text-orange-600" />,
//         title: "30 Days Return",
//         description: "Simply return it within 30 days for an exchange",
//     },
//     {
//         icon: <FaDonate className="text-4xl text-red-600" />,
//         title: "Payment Secure",
//         description: "Contact us 24 hours a day, 7 days a week",
//     },
// ];

// export default function Services() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {services.map((service, index) => (
//           <div
//             key={index}
//             className="p-6 text-center border rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105"
//           >
//             <div className="mb-4 flex justify-center">{service.icon}</div>
//             <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
//             <p className="text-gray-600">{service.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
