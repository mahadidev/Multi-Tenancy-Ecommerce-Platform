import React from "react";

interface LoadingOverlayProps {
    isLoading: boolean;
    position?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    position = "absolute",
}) => {
    if (!isLoading) return null;

    return (
        <div
            className={`${position} inset-0 flex items-center justify-center bg-black bg-opacity-30 z-[9999999999999999] rounded-md`}
        >
            <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-black text-lg font-semibold">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
