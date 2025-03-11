import { Button, Modal } from "flowbite-react";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionSuccessModal: FC<{ status: string }> = ({ status }) => {
    const [open, setOpen] = useState<boolean>(true);
    const navigate = useNavigate();

    const onClose = () => {
        navigate("/upgrade-plan");
        setOpen(false);
    };

    useEffect(() => {
        setOpen(status === "success" ? true : false);
        setTimeout(() => {
            onClose();
        }, 8000);

        return () => {
            onClose();
        };
    }, [status]);

    return (
        <Modal show={open} onClose={onClose} size="2xl">
            <Modal.Header>Subscription Success</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col justify-center items-center gap-3">
                    {" "}
                    <h2 className="text-2xl text-center dark:text-white">
                        Your subscription has been successful. Thank you for
                        choosing Cholo Gori!
                    </h2>
                    <p className="mb-5 text-lg dark:text-white">
                        We'll send you an email confirmation shortly.
                    </p>
                    <Button size="xl" color="blue" onClick={() => onClose()}>
                        OK
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default SubscriptionSuccessModal;
