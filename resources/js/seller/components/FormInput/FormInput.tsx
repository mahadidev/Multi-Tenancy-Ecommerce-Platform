import { Label, TextInput } from "flowbite-react";
import { ChangeEventHandler, FC } from "react";

interface FormInputProps {
    id: string;
    label: string;
    type?: string;
    formState: any;
    formErrors: any;
    handleChange: ChangeEventHandler<HTMLInputElement>;
}
const FormInput: FC<FormInputProps> = ({
    id,
    label,
    type = "text",
    formState,
    formErrors,
    handleChange,
}) => {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <TextInput
                id={id}
                name={id}
                type={type}
                placeholder={label}
                value={formState[id] || ""}
                color={formErrors[id] ? "failure" : "gray"}
                helperText={formErrors[id]?.[0] || ""}
                onChange={handleChange}
                required
            />
        </div>
    );
};

export default FormInput;
