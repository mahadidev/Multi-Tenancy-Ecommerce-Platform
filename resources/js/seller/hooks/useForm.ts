/* eslint-disable prefer-const */
import React, { useEffect, useState } from "react";

const useForm = (props: any) => {
    const [formState, setFormState] = useState<any>(
        props.defaultState ? props.defaultState : {}
    );
    const [formErrors, setFormErrors] = useState<any>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange?: CallableFunction
    ) => {
        let {
            name,
            value,
            type,
            files,
        }: { name: string; value: any; type: string; files: any } = e.target;

        if (type !== "file" && type !== "tel") {
            if (/^\d+$/.test(value)) {
                value = parseInt(value);
            }
        }

        if (files) {
            value = files[0];
        }

        if (onChange) {
            onChange({
                name: name,
                value: value,
            });
        }
        setFormErrors((prev: any) => ({ ...prev, [name]: null }));
        setFormState((prev: any) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (props.errors && props.errors?.errors) {
            setFormErrors(props.errors.errors);
        }
    }, [props.errors]);

    return {
        handleChange,
        formState,
        setFormState,
        formErrors,
        ...props,
    };
};

export default useForm;
