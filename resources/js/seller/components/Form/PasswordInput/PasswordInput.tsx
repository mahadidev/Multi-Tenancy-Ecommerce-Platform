import { Button, TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordInput: FC<any> = (props) => {
    const [type, setType] = useState<string>("password");
    return (
        <div className="relative">
            <TextInput className="w-full h-full z-10" {...{ ...props, type }} />
            <div className="absolute right-1 top-[20%]">
                {type === "password" ? (
                    <Button
                        size="xs"
                        color="primary"
                        onClick={() => setType("text")}
                    >
                        <FiEye color="white" />
                    </Button>
                ) : (
                    <Button
                        size="xs"
                        style={{ outline: "none", textDecoration: "none" }}
                        color="primary"
                        onClick={() => setType("password")}
                    >
                        <FiEyeOff color="white" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PasswordInput;
