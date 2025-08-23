import { TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordInput: FC<any> = (props) => {
    const [type, setType] = useState<string>("password");
    const { value, ...restProps } = props;
    
    return (
        <div className="relative">
            <TextInput
                className="w-full h-full z-10"
                {...restProps}
                type={type}
                value={value ?? ""}
                autoComplete="off"
            />
            <div className="absolute h-max right-2 top-0 bottom-0 my-auto">
                <button
                    onClick={() =>
                        setType(type === "text" ? "password" : "text")
                    }
                    className="flex justify-center items-center py-1 px-2 rounded-md bg-gray-200 dark:bg-[#1F2937] text-gray-800 dark:text-white"
                >
                    {type === "password" ? (
                        <FiEye className="text-sm text-gray-900 dark:text-white" />
                    ) : (
                        <FiEyeOff className="text-sm text-gray-900 dark:text-white" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
//
// #F3F4F6
