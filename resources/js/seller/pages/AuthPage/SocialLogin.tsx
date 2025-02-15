import useAuth from "@seller/hooks/useAuth";
import { Button } from "flowbite-react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";

const SocialLogin = () => {
    const { loginWithFacebook, loginWithGoogle } = useAuth();
    return (
        <div className="flex flex-col items-center w-full max-w-sm mx-auto">
            <div className="flex items-center w-full mb-4">
                <hr className="flex-grow border-gray-300 dark:border-gray-600" />
                <span className="mx-4 text-gray-500 dark:text-gray-400">
                    Or log in with
                </span>
                <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex space-x-4">
                <Button
                    color="blue"
                    className="!rounded-full !w-16 !h-16"
                    onClick={() => loginWithFacebook.submit()}
                >
                    <FaFacebookF size={20} />
                </Button>

                <Button
                    color="light"
                    className="!rounded-full !w-16 !h-16"
                    onClick={() => loginWithGoogle.submit()}
                >
                    <FaGoogle size={20} />
                </Button>
            </div>
        </div>
    );
};

export default SocialLogin;
