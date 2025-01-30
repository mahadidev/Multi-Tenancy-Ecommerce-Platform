import { FileInputProps, TextInput } from "flowbite-react";
import { FC, RefAttributes } from "react";
import { IoMdColorFilter } from "react-icons/io";

const ColorInput: FC<
    (FileInputProps & RefAttributes<HTMLInputElement>) | any
> = (props) => {
    return (
        <>
            <div className="relative">
                <div
                    className="w-full h-10 rounded-md flex justify-center items-center"
                    style={{ background: props.value }}
                >
                    <button className="w-full h-full flex justify-center items-center bg-white/25 rounded-md shadow-md">
                        <IoMdColorFilter />
                    </button>
                </div>
                <TextInput
                    className="opacity-0 w-full h-full absolute top-0 left-0 z-10"
                    {...{ ...props, type: "color" }}
                />
            </div>
        </>
    );
};

export default ColorInput;
