/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";

export interface FormStateType {
    [Key: string]: string | number;
}

export interface FormErrorType {
    [key: string]: string[] | string;
}

interface ChangeEventTargetType {
    name: string;
    value: any;
    type: string;
    files: any;
}

interface FormProps {
    default?: FormStateType | any;
    errors?: FormErrorType | any;
    formValidationError?:
        | {
              message: string;
              errors: FormErrorType[];
          }
        | FetchBaseQueryError
        | SerializedError
        | undefined;
}

const useForm = function (props?: FormProps) {
    const [formState, setFormState] = useState<FormStateType | any>(
        props?.default ?? {}
    );
    const [formErrors, setFormErrors] = useState<FormErrorType | any>({});

    // on change form input
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | any>,
        onChange?: CallableFunction
    ) => {
        let { name, value, type, files }: ChangeEventTargetType = e.target;
        // if type text that is num convert it to int
        if (type !== "file" && type !== "tel") {
            if (/^\d+$/.test(value)) {
                value = parseInt(value);
            }
        }
        // if has files
        if (files) {
            value = files[0];
            console.log(files);
        }
        // if has on change
        if (onChange) {
            onChange({
                name: name,
                value: value,
            });
        }
        setFormErrors((prev: any) => ({
            ...prev,
            [name]: null,
            message: null,
        }));
        setFormState((prev: any) => ({ ...prev, [name]: value }));
    };

    // watch errors if any error set it form state error
    useEffect(() => {
        if (props?.errors) {
            setFormErrors(props.errors);
        }
    }, [props?.errors]);

    // formValidationError
    useEffect(() => {
        if (props && props.formValidationError) {
            setFormErrors((prev: FormErrorType) => ({
                ...prev,
                message:
                    props.formValidationError &&
                    "message" in props.formValidationError
                        ? props.formValidationError.message
                        : "",
                ...(props.formValidationError &&
                "errors" in props.formValidationError
                    ? props.formValidationError.errors
                    : {}),
            }));
        }
    }, [props?.formValidationError]);

    return { formState, setFormState, formErrors, setFormErrors, handleChange };
};

export default useForm;
