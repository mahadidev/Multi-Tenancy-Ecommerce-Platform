import useToast from "@seller/_hooks/useToast";
import { useEffect, useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";

const ToastMessage = () => {
    const { toast, dismissToaster } = useToast();
    const [isVisible, setIsVisible] = useState(false);
    const [currentToast, setCurrentToast] = useState(toast);

    useEffect(() => {
        if (toast) {
            setCurrentToast(toast);
            // Small delay to trigger animation
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        } else {
            setIsVisible(false);
            // Keep toast content during fade out animation
            setTimeout(() => setCurrentToast(null), 300);
        }
    }, [toast]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => dismissToaster(), 300);
    };

    // Simple bubble animation styles
    const bubbleAnimation = `
        @keyframes bubble {
            0% {
                transform: scale(0) translateY(20px);
                opacity: 0;
            }
            50% {
                transform: scale(1.05) translateY(-5px);
            }
            100% {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes bubbleOut {
            0% {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
            100% {
                transform: scale(0.9) translateY(10px);
                opacity: 0;
            }
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-3px);
            }
        }
        
        .toast-bubble-in {
            animation: bubble 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .toast-bubble-out {
            animation: bubbleOut 0.3s ease-in forwards;
        }
        
        .toast-float {
            animation: float 3s ease-in-out infinite;
        }
    `;

    // Minimal toast component
    const MinimalToast = () => {
        if (!currentToast) return null;

        // Determine icon and colors based on status
        const getStatusConfig = () => {
            switch (currentToast.status) {
                case 'success':
                    return {
                        icon: <HiCheck className="w-4 h-4" />,
                        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                        borderColor: 'border-blue-200 dark:border-blue-800',
                        iconColor: 'text-blue-600 dark:text-blue-400',
                        textColor: 'text-gray-800 dark:text-gray-200'
                    };
                case 'danger':
                case 'error':
                    return {
                        icon: <HiX className="w-4 h-4" />,
                        bgColor: 'bg-red-50 dark:bg-red-900/20',
                        borderColor: 'border-red-200 dark:border-red-800',
                        iconColor: 'text-red-600 dark:text-red-400',
                        textColor: 'text-gray-800 dark:text-gray-200'
                    };
                case 'warning':
                    return {
                        icon: <span className="w-4 h-4 text-center">!</span>,
                        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
                        borderColor: 'border-yellow-200 dark:border-yellow-800',
                        iconColor: 'text-yellow-600 dark:text-yellow-400',
                        textColor: 'text-gray-800 dark:text-gray-200'
                    };
                case 'info':
                    return {
                        icon: <span className="w-4 h-4 text-center">i</span>,
                        bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
                        borderColor: 'border-cyan-200 dark:border-cyan-800',
                        iconColor: 'text-cyan-600 dark:text-cyan-400',
                        textColor: 'text-gray-800 dark:text-gray-200'
                    };
                default:
                    return {
                        icon: <span className="w-4 h-4">•</span>,
                        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
                        borderColor: 'border-gray-200 dark:border-gray-800',
                        iconColor: 'text-gray-600 dark:text-gray-400',
                        textColor: 'text-gray-800 dark:text-gray-200'
                    };
            }
        };

        const config = getStatusConfig();

        return (
            <div
                className={`
                    fixed bottom-6 left-6 z-[60]
                    flex items-center gap-3 
                    px-4 py-3 
                    ${config.bgColor}
                    border ${config.borderColor}
                    rounded-full
                    shadow-lg backdrop-blur-sm
                    ${isVisible ? 'toast-bubble-in toast-float' : 'toast-bubble-out'}
                    max-w-sm
                `}
            >
                {/* Simple icon */}
                <div className={`flex-shrink-0 ${config.iconColor}`}>
                    {config.icon}
                </div>
                
                {/* Text content */}
                <div className="flex-1">
                    <p className={`text-sm font-medium ${config.textColor}`}>
                        {currentToast.text}
                    </p>
                    {currentToast.description && (
                        <p className={`text-xs mt-0.5 opacity-75 ${config.textColor}`}>
                            {currentToast.description}
                        </p>
                    )}
                </div>
                
                {/* Simple close button */}
                <button
                    onClick={handleDismiss}
                    className={`
                        flex-shrink-0 
                        ${config.iconColor} 
                        hover:opacity-70 
                        transition-opacity
                        focus:outline-none
                    `}
                >
                    <HiX className="w-3 h-3" />
                </button>
                
                {/* Subtle progress indicator */}
                <div 
                    className={`
                        absolute bottom-0 left-0 h-[2px] 
                        bg-current opacity-20 
                        rounded-full
                        ${config.iconColor}
                    `}
                    style={{
                        width: isVisible ? '0%' : '100%',
                        transition: isVisible ? 'width 3000ms linear' : 'none'
                    }}
                />
            </div>
        );
    };

    return (
        <>
            <style>{bubbleAnimation}</style>
            {currentToast && <MinimalToast />}
        </>
    );
};

export default ToastMessage;