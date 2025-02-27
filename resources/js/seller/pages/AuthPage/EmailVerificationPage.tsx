import useAuth from "@seller/hooks/useAuth";
import { Button, Card } from "flowbite-react";
import React, { useCallback } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";

const EmailVerificationPage: React.FC = () => {
    const { emailVerification } = useAuth();
    const { submit, isLoading } = emailVerification;
    const [searchParams] = useSearchParams();

    const token: string = searchParams.get("token") || "";

    // handle verify email
    const handleVerification = useCallback(() => {
        if (token) {
            submit({ formData: { token } });
        }
    }, [token]);

    return (
        <Card className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
            <Button
                color="primary"
                onClick={handleVerification}
                processingSpinner={
                    <AiOutlineLoading className="h-6 w-6 animate-spin text-red-500" />
                }
                processingLabel="Verifying..."
                isProcessing={isLoading}
                disabled={!token} // Prevents submitting if token is missing
            >
                Submit for Verification
            </Button>
        </Card>
    );
};

export default EmailVerificationPage;
