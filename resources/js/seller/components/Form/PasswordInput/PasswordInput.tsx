import { TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordInput: FC<any> = (props) => {
    const [type, setType] = useState<string>("password");
    return (
        <div className="relative">
            <TextInput className="w-full h-full z-10" {...{ ...props, type }} />
            <div className="absolute right-1 top-[13%]">
                <button
                    onClick={() =>
                        setType(type === "text" ? "password" : "text")
                    }
                    className="flex justify-center items-center py-2 px-3 rounded-lg bg-gray-200 dark:bg-[#1F2937] text-gray-800 dark:text-white"
                >
                    {type === "password" ? (
                        <FiEye className="text-gray-600 dark:text-white" />
                    ) : (
                        <FiEyeOff className="text-gray-600 dark:text-white" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
//
// #F3F4F6
