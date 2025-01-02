import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

const useForm = ({ errors }: { errors?: any }) => {
    const [formState, setFormState] = useState<any>({});
    const [formErrors, setFormErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // eslint-disable-next-line prefer-const
        let { name, value }: { name: string; value: any } = e.target;

        if (/^\d+$/.test(value)) {
            value = parseInt(value);
        }

        setFormErrors((prev: any) => ({ ...prev, [name]: null }));
        setFormState((prev: any) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (errors && errors?.errors) {
            setFormErrors(errors.errors);
        }
    }, [errors]);

    return {
        handleChange,
        formState,
        setFormState,
        formErrors,
    };
};

export default useForm;
