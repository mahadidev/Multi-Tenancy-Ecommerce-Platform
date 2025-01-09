import { useAppSelector } from "@/seller/store";
import { useUpdateStoreMutation } from "@/seller/store/reducers/storeApi";
import { Button, Card, Modal } from "flowbite-react";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ResetCard = () => {
    const { currentStore: store } = useAppSelector((state) => state.store);
    const [updateStore, { isLoading }] = useUpdateStoreMutation();
    const [isResetModal, setResetModal] = useState<boolean>(false);

    const handleReset = () => {
        updateStore({
            storeId: store.id,
            formData: {
                settings: null,
            },
        }).then((response) => {
            if (response.data.status === 200) {
                setResetModal(false);
            }
        });
    };

    return (
        <>
            <Card>
                <div className="flow-root">
                    <h3 className="text-xl font-bold dark:text-white">Reset</h3>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        <li className="py-4">
                            <div className="flex items-center space-x-4">
                                <div className="shrink-0">
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 7.205c4.418 0 8-1.165 8-2.602C20 3.165 16.418 2 12 2S4 3.165 4 4.603c0 1.437 3.582 2.602 8 2.602ZM12 22c4.963 0 8-1.686 8-2.603v-4.404c-.052.032-.112.06-.165.09a7.75 7.75 0 0 1-.745.387c-.193.088-.394.173-.6.253-.063.024-.124.05-.189.073a18.934 18.934 0 0 1-6.3.998c-2.135.027-4.26-.31-6.3-.998-.065-.024-.126-.05-.189-.073a10.143 10.143 0 0 1-.852-.373 7.75 7.75 0 0 1-.493-.267c-.053-.03-.113-.058-.165-.09v4.404C4 20.315 7.037 22 12 22Zm7.09-13.928a9.91 9.91 0 0 1-.6.253c-.063.025-.124.05-.189.074a18.935 18.935 0 0 1-6.3.998c-2.135.027-4.26-.31-6.3-.998-.065-.024-.126-.05-.189-.074a10.163 10.163 0 0 1-.852-.372 7.816 7.816 0 0 1-.493-.268c-.055-.03-.115-.058-.167-.09V12c0 .917 3.037 2.603 8 2.603s8-1.686 8-2.603V7.596c-.052.031-.112.059-.165.09a7.816 7.816 0 0 1-.745.386Z" />
                                    </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-base font-semibold text-gray-900 dark:text-white">
                                        Reset Settings
                                    </p>
                                    <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                                        Social Media, Contact
                                    </p>
                                </div>
                                <div className="inline-flex items-center">
                                    <Button
                                        size="sm"
                                        color={"blue"}
                                        onClick={() => setResetModal(true)}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </Card>

            <Modal
                show={isResetModal}
                size="md"
                onClose={() => setResetModal(false)}
                popup
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <div className="mb-5 ">
                            <h3 className="text-lg font-normal text-gray-800 dark:text-gray-200">
                                Are you sure to reset Settings?
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Data: Social Media, Contact
                            </p>
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={handleReset}
                                disabled={isLoading}
                                isProcessing={isLoading}
                                processingLabel="Reseting"
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                            >
                                {"Yes, I'm sure"}
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setResetModal(false)}
                            >
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ResetCard;
