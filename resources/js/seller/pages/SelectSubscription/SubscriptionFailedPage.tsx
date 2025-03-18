import { Button, Card } from "flowbite-react";
import { FC } from "react";
import { MdSmsFailed } from "react-icons/md";
import { Link } from "react-router-dom";

const SubscriptionFailedPage: FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="max-w-md w-full p-6 text-center shadow-lg rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                    <MdSmsFailed className="w-12 h-12 text-red-500" />
                    <h2 className="dark:text-white text-gray-900 text-2xl font-bol">
                        Subscription failed!
                    </h2>
                    <p className="dark:text-gray-300 text-gray-600 text-sm">
                        Your payment failed. Please try again or contact our
                        support team for assistance.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to={"/"}>
                            <Button color="primary">Your dashboard</Button>
                        </Link>
                        <Link to={"/select-subscriptions"}>
                            <Button color="blue">Subscriptions</Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SubscriptionFailedPage;
