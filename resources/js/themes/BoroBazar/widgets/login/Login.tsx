import { ThemeWidgetPropsType } from "@type/themeType";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Link } from "react-router-dom";
import SocialLogin from "../../components/Auth/SocialLogin";
import PasswordInput from "../../components/Form/PasswordInput/PasswordInput";
import useForm from "../../hooks/useForm";

const Login: FC<ThemeWidgetPropsType> = function () {
    // const { register } = useAuth();
    const { formState, formErrors, handleChange } = useForm({
        default: {
            email: "",
            password: "",
        },
        // formValidationError: register.error,
    });

    return (
        <>
            <div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
                <Card
                    horizontal
                    className="w-full md:max-w-screen-lg *:object-cover"
                    theme={{
                        root: {
                            children:
                                "my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16",
                        },
                        img: {
                            horizontal: {
                                on: "hidden w-2/3 rounded-l-lg md:w-96 md:p-0 lg:block !object-cover",
                            },
                        },
                    }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                        Login
                    </h2>
                    <div className="mt-8 space-y-6">
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="email">Your email</Label>
                            <TextInput
                                id="email"
                                name="email"
                                placeholder="name@gmail.com"
                                type="email"
                                value={formState["email"]}
                                color={formErrors["email"] ? "failure" : "gray"}
                                helperText={
                                    formErrors["email"]
                                        ? formErrors["email"][0]
                                        : false
                                }
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="password">Your password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                type="password"
                                value={formState["password"]}
                                color={
                                    formErrors["password"] ? "failure" : "gray"
                                }
                                helperText={
                                    formErrors["password"]
                                        ? formErrors["password"][0]
                                        : false
                                }
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-3">
                                <Checkbox
                                    id="rememberMe"
                                    name="rememberMe"
                                    value={formState["rememberMe"]}
                                    onChange={handleChange}
                                    color="gray"
                                />
                                <Label htmlFor="rememberMe">Remember me</Label>
                            </div>
                            <Link
                                to={`/forgot-password`}
                                className="text-right text-sm text-primary-700 hover:underline dark:text-light-500"
                            >
                                Lost Password?
                            </Link>
                        </div>
                        {/* {formErrors["message"] && (
                            <ErrorMessage>{formErrors["message"]}</ErrorMessage>
                        )} */}
                        <div className="mb-7">
                            <Button
                                size="lg"
                                color="green"
                                type="button"
                                theme={{ inner: { base: "px-5 py-3" } }}
                                className="w-full px-0 py-px sm:w-auto"
                                onClick={() => console.log(formState)}
                                // onClick={() => {
                                //     register.submit({
                                //         formData: formState,
                                //     });
                                // }}
                                // isProcessing={register.isLoading}
                                // disabled={register.isLoading}
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                            >
                                Login to your account
                            </Button>
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-light-400">
                            Not registered?&nbsp;
                            <Link
                                to={"register"}
                                className="text-primary-700 hover:underline dark:text-light-500"
                            >
                                Registration
                            </Link>
                        </p>

                        <SocialLogin />
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Login;
