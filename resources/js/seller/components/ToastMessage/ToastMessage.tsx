import useToast from "@seller/hooks/useToast";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

const ToastMessage = () => {
    const { toast, dismissToaster } = useToast();

    // useEffect(() => {
    //     console.log(toast);
    // }, [toast])

    return (
        <>
            {toast && (
                <>
                    {toast?.status === "success" && (
                        <Toast className="fixed right-4 top-4 z-[60]">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="grid gap-2">
                                <div className="ml-3 text-md font-normal">
                                    {toast.text}
                                </div>
                                {toast?.description && (
                                    <div className="ml-3 text-sm font-normal">
                                        {toast.description}
                                    </div>
                                )}
                            </div>
                            <Toast.Toggle onDismiss={dismissToaster} />
                        </Toast>
                    )}

                    {toast?.status === "danger" && (
                        <Toast className="fixed right-4 top-4 z-[60]">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                <HiX className="h-5 w-5" />
                            </div>
                            <div className="grid gap-2">
                                <div className="ml-3 text-md font-normal">
                                    {toast.text}
                                </div>
                                {toast?.description && (
                                    <div className="ml-3 text-sm font-normal">
                                        {toast.description}
                                    </div>
                                )}
                            </div>

                            <Toast.Toggle onDismiss={dismissToaster} />
                        </Toast>
                    )}

                    {toast?.status === "error" && (
                        <Toast className="fixed right-4 top-4 z-[60]">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                <HiExclamation className="h-5 w-5" />
                            </div>
                            <div className="grid gap-2">
                                <div className="ml-3 text-md font-normal">
                                    {toast.text}
                                </div>
                                {toast?.description && (
                                    <div className="ml-3 text-sm font-normal">
                                        {toast.description}
                                    </div>
                                )}
                            </div>

                            <Toast.Toggle onDismiss={dismissToaster} />
                        </Toast>
                    )}
                </>
            )}
        </>
    );
};
export default ToastMessage;
