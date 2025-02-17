import useAuth from "@seller/hooks/useAuth";
import { Button, Card } from "flowbite-react";
import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";

const EmailVerificationPage: React.FC = () => {
    const { emailVerification } = useAuth();
    const [searchParams] = useSearchParams();

    // token from page query
    const token = searchParams.get("token");

    return (
        <Card className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
            <Button
                color="primary"
                onClick={() =>
                    emailVerification.submit({
                        formData: {
                            token: token as string,
                        },
                    })
                }
                processingSpinner={
                    <AiOutlineLoading className="text-red-500 h-6 w-6 animate-spin" />
                }
                processingLabel="Verifying..."
                isProcessing={emailVerification.isLoading}
            >
                Submit for Verification
            </Button>
        </Card>
    );
};

export default EmailVerificationPage;
