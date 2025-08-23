import useAuth from "@seller/_hooks/useAuth";
import { Card } from "flowbite-react";
import React, { useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";

const SocialMediaPage: React.FC = () => {
    const { verifySocialMediaAuthentication } = useAuth();
    const [searchParams] = useSearchParams();

    // token and user id from page query
    const token = searchParams.get("token");
    const userId = searchParams.get("user_id");

    // send request
    useEffect(() => {
        if (token && userId) {
            verifySocialMediaAuthentication.submit({
                formData: {
                    token: token as string,
                    user_id: userId as string,
                },
            });
        } else {
            // redirect to login page if token and user id are not provided
            window.location.href = "/seller/login";
        }
    }, [token, userId]);
    return (
        <Card className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
            <AiOutlineLoading className="text-red-500 h-6 w-6 animate-spin" />
        </Card>
    );
};

export default SocialMediaPage;
