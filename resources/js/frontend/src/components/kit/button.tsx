import React from "react";

const Button = ({
    children,
    variant,
}: {
    children: React.ReactNode;
    variant?: "white" | "default";
}) => {
    const variants = {
        default: "bg-primary text-white shadow hover:bg-primary/90",
        white: "bg-white text-primary shadow hover:bg-primary hover:text-white",
    };

    return (
        <button
            className={`${
                variants[variant ? variant : "default"]
            } text-sm sm:text-base px-5 sm:px-6 py-1.5 sm:py-2.5 rounded-full font-medium `}
        >
            {children}
        </button>
    );
};

export default Button;
