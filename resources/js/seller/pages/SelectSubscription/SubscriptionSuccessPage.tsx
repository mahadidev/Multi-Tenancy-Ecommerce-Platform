import { Card } from "flowbite-react";
import { FC } from "react";
import Confetti from "react-confetti";
import { FaCheckCircle } from "react-icons/fa";
import { useWindowSize } from "react-use";

const SubscriptionSuccessPage: FC = () => {
    const { width, height } = useWindowSize();

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Confetti width={width} height={height} />
            <Card className="max-w-md w-full p-6 text-center shadow-lg rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                    <FaCheckCircle className="w-12 h-12 text-green-500" />
                    <h2 className="dark:text-white text-gray-900 text-2xl font-bol">
                        Subscription succeeded!
                    </h2>
                    <p className="dark:text-gray-300 text-gray-600 text-sm">
                        Thank you for processing your most recent payment for
                        subscription. <br />
                        Explore your premium subscription and stay connected
                        with us{" "}
                    </p>
                    <button className="dark:bg-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium">
                        Your dashboard
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default SubscriptionSuccessPage;
