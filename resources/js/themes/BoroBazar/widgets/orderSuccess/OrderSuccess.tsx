import { ThemeWidgetPropsType } from "@type/themeType";
import { Card } from "flowbite-react";
import { FC } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";

const OrderSuccess: FC<ThemeWidgetPropsType> = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="text-center w-[400px]">
                <div className="flex justify-center mb-2">
                    <div className="w-20 h-20 bg-[#5CAF90] rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>
                <h2 className="text-lg font-semibold leading-[10px]">
                    Thank you for ordering.
                </h2>
                <p className="text-gray-500 text-md">
                    You will get it soon. <br />
                    stay with{" "}
                    <span className="text-[#5CAF90] font-bold">CholoGori</span>
                </p>

                <Link to="/shop" className="text-center">
                    <button className="bg-[#5CAF90] px-3 py-2 text-white rounded-md">
                        <div className="flex items-center gap-3">
                            <AiOutlineArrowLeft /> Back to Shopping
                        </div>
                    </button>
                </Link>
            </Card>
        </div>
    );
};

export default OrderSuccess;
