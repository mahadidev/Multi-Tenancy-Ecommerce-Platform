import { Button } from "flowbite-react";
import { FC } from "react";

const SocialLogin: FC = () => {
    return (
        <div className="flex flex-col items-center w-full max-w-sm mx-auto">
            <div className="flex items-center w-full mb-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-4 text-gray-500 dark:text-gray-400">
                    Or log in with
                </span>
                <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex ">
                {/* <button
                    type="button"
                    onClick={() => loginWithFacebook.submit()}
                    className="login-with-google-btn"
                    disabled
                >
                    Sign in with Facebook
                </button> */}

                <Button
                    type="button"
                    // onClick={() => loginWithGoogle.submit()}
                    className="login-with-google-btn"
                >
                    {/* {loginWithGoogle?.isLoading
                        ? "Login inprogress..."
                        : "Sign in with Google"} */}
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
};

export default SocialLogin;
