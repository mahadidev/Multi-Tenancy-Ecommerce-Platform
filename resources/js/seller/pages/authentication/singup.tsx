import { APP_IMAGE_URL, BASE_IMAGE_URL } from "@/env";
import { RoutePath } from "@/seller/env";
import useForm from "@/seller/hooks/useForm";
import { useRegisterUserMutation } from "@/seller/store/reducers/authApi";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const [register, { isLoading, error }] = useRegisterUserMutation();

    const { formState, handleChange, formErrors } = useForm({
        errors: error,
    });

    const navigate = useNavigate();

    const handleRegister = (formState: any) => {
        register(formState).then((response: any) => {
            if (response.data.status === 200) {
                navigate(RoutePath.storeCreate);
            }
        });
    };

    return (
        <div className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
            <Link
                to="/"
                className="mb-8 flex items-center justify-center text-2xl font-semibold lg:mb-10 dark:text-white"
            >
                <img
                    alt=""
                    src={`${BASE_IMAGE_URL}/logos/logo-black.png`}
                    width={43}
                    height={44}
                    className="mr-4 h-11 w-auto dark:hidden"
                />
                <img
                    alt=""
                    src={`${BASE_IMAGE_URL}/logos/logo-white.png`}
                    width={43}
                    height={44}
                    className="mr-4 h-11 w-auto hidden dark:block"
                />
            </Link>
            <Card
                horizontal
                imgSrc={`${APP_IMAGE_URL}/authentication/login.jpg`}
                imgAlt=""
                className="w-full md:max-w-screen-lg *:object-cover"
                theme={{
                    root: {
                        children:
                            "my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16",
                    },
                    img: {
                        horizontal: {
                            on: "hidden rounded-l-lg md:w-96 md:p-0 lg:block",
                        },
                    },
                }}
            >
                <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                    Create a Free Account
                </h2>
                <div className="mt-8 space-y-6">
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="email">Your name</Label>
                        <TextInput
                            id="name"
                            name="name"
                            placeholder="Doe Json"
                            type="name"
                            value={formState["name"]}
                            color={formErrors["name"] ? "failure" : "gray"}
                            helperText={
                                formErrors["name"]
                                    ? formErrors["name"][0]
                                    : false
                            }
                            onChange={handleChange}
                        />
                    </div>
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
                        />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="password">Your password</Label>
                        <TextInput
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            type="password"
                            value={formState["password"]}
                            color={formErrors["password"] ? "failure" : "gray"}
                            helperText={
                                formErrors["password"]
                                    ? formErrors["password"][0]
                                    : false
                            }
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm password
                        </Label>
                        <TextInput
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="••••••••"
                            type="password"
                            value={formState["confirm_password"]}
                            color={
                                formErrors["confirm_password"]
                                    ? "failure"
                                    : "gray"
                            }
                            helperText={
                                formErrors["confirm_password"]
                                    ? formErrors["confirm_password"][0]
                                    : false
                            }
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-x-3">
                        <Checkbox id="acceptTerms" name="acceptTerms" />
                        <Label htmlFor="acceptTerms">
                            I accept the&nbsp;
                            <Link
                                to={`/terms-conditions`}
                                className="text-primary-700 hover:underline dark:text-primary-500"
                            >
                                Terms and Conditions
                            </Link>
                        </Label>
                    </div>
                    <div className="mb-7">
                        <Button
                            size="lg"
                            color="primary"
                            type="button"
                            theme={{ inner: { base: "px-5 py-3" } }}
                            className="w-full px-0 py-px sm:w-auto"
                            onClick={() => handleRegister(formState)}
                            isProcessing={isLoading}
                            disabled={isLoading}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                        >
                            Create account
                        </Button>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Already have an account?&nbsp;
                        <Link
                            to={RoutePath.login}
                            className="text-primary-700 hover:underline dark:text-primary-500"
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
