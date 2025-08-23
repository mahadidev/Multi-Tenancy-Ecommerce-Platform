import { FormErrorType, FormStateType } from "@seller/_hooks/useForm";
import useStore from "@seller/_hooks/useStore";
import useString from "@seller/_hooks/useString";
import { StoreTypesType } from "@type/storeType";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { ChangeEventHandler, FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface PropsType {
    stepNum: number;
    setStepNum: CallableFunction;
    formState: FormStateType;
    formErrors: FormErrorType;
    handleChange: ChangeEventHandler<any>;
    setFormState: CallableFunction;
}

const StoreStepOne: FC<PropsType> = function (props) {
    const { getSlug } = useString();
    const { storeTypes } = useStore();
    return (
        <div
            className={`space-y-8  ${props.stepNum === 1 ? "block" : "hidden"}`}
        >
            <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                Create a store
            </h2>

            <div className="mt-8 space-y-6">
                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="name">Store name</Label>
                    <TextInput
                        id="name"
                        name="name"
                        placeholder="ex. Goody Bro"
                        type="email"
                        value={props.formState["name"]}
                        color={props.formErrors["name"] ? "failure" : "gray"}
                        helperText={
                            props.formErrors["name"]
                                ? props.formErrors["name"][0]
                                : false
                        }
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            props.handleChange(event);

                            props.setFormState((prev: any) => ({
                                ...prev,
                                domain: getSlug(event.target.value),
                            }));
                        }}
                    />
                </div>
                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="domain">Store Slug</Label>
                    <TextInput
                        id="domain"
                        name="domain"
                        placeholder="ex. goody-bro"
                        type="text"
                        value={props.formState["domain"]}
                        color={props.formErrors["domain"] ? "failure" : "gray"}
                        helperText={
                            props.formErrors["domain"]
                                ? props.formErrors["domain"][0]
                                : false
                        }
                        onChange={props.handleChange}
                    />
                </div>
                <div className="flex flex-col gap-y-2">
                    <Label htmlFor="store_type_id">Store Types</Label>

                    <Select
                        id="store_type_id"
                        name="store_type_id"
                        value={props.formState["store_type_id"] || 1}
                        color={
                            props.formErrors["store_type_id"]
                                ? "failure"
                                : "gray"
                        }
                        helperText={
                            props.formErrors["store_type_id"]
                                ? props.formErrors["store_type_id"][0]
                                : false
                        }
                        onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>
                        ) => {
                            if (event.target.value === "0") {
                                event.target.value = "null";
                            }
                            props.handleChange(event);
                        }}
                        required
                    >
                        <option value={0}>Select a Store Type</option>
                        {storeTypes?.map(
                            (storeType: StoreTypesType, idx: number) => (
                                <option value={storeType?.id} key={idx}>
                                    {storeType?.label}
                                </option>
                            )
                        )}
                    </Select>
                </div>

                <div className="mb-6 flex items-center justify-between">
                    <Button
                        type="button"
                        size="lg"
                        color="primary"
                        theme={{ inner: { base: "px-5 py-3" } }}
                        className="w-full px-0 py-px sm:w-auto"
                        onClick={() => {
                            props.setStepNum(2);
                        }}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        Next: Store branding
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default StoreStepOne;
