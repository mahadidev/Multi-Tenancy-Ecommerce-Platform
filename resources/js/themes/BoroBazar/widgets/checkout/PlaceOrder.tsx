import { ThemeWidgetPropsType } from "@type/themeType";
import {
    Button,
    Card,
    Label,
    Select,
    Textarea,
    TextInput,
} from "flowbite-react";
import { FC } from "react";
import useForm from "../../hooks/useForm";

const PlaceOrder: FC<ThemeWidgetPropsType> = () => {
    const { formState, formErrors, handleChange } = useForm({
        default: {
            name: "",
            email: "",
            phone: "",
            address: "",
            payment_method: "",
            notes: "",
        },
    });

    return (
        <section className="mt-10">
            <div className="container mx-auto">
                <div className="lg:flex gap-4 items center">
                    <div className="lg:w-5/12"></div>
                    <div className="lg:w-7/12">
                        <Card>
                            <h2 className="text-2xl font-bold my-3">
                                Billing Details
                            </h2>

                            <div className="grid gap-3">
                                <div className="grid lg:grid-cols-2 gap-2">
                                    <div className="flex flex-col gap-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            placeholder="Enter full name"
                                            type="text"
                                            value={formState["name"]}
                                            color={
                                                formErrors["name"]
                                                    ? "failure"
                                                    : "gray"
                                            }
                                            helperText={
                                                formErrors["name"]
                                                    ? formErrors["name"][0]
                                                    : false
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <TextInput
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email address"
                                            type="email"
                                            value={formState["email"]}
                                            color={
                                                formErrors["email"]
                                                    ? "failure"
                                                    : "gray"
                                            }
                                            helperText={
                                                formErrors["email"]
                                                    ? formErrors["email"][0]
                                                    : false
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid lg:grid-cols-2 gap-2">
                                    <div className="flex flex-col gap-y-2">
                                        <Label htmlFor="phone">
                                            Phone Number
                                        </Label>
                                        <TextInput
                                            id="phone"
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            type="tel"
                                            value={formState["phone"]}
                                            color={
                                                formErrors["phone"]
                                                    ? "failure"
                                                    : "gray"
                                            }
                                            helperText={
                                                formErrors["phone"]
                                                    ? formErrors["phone"][0]
                                                    : false
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="payment_method">
                                            Payment Method
                                        </Label>
                                        <Select
                                            id="payment_method"
                                            name="payment_method"
                                            value={formState["payment_method"]}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value={0}>
                                                Select a payment method
                                            </option>
                                            <option value={"cash"}>Cash</option>
                                            <option value={"card"}>Card</option>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-y-2">
                                    <Label htmlFor="address">
                                        Address Line
                                    </Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        placeholder="Enter your address"
                                        value={formState["address"]}
                                        color={
                                            formErrors["address"]
                                                ? "failure"
                                                : "gray"
                                        }
                                        helperText={
                                            formErrors["address"]
                                                ? formErrors["address"][0]
                                                : false
                                        }
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        placeholder="Enter your notes"
                                        value={formState["notes"]}
                                        color={
                                            formErrors["notes"]
                                                ? "failure"
                                                : "gray"
                                        }
                                        helperText={
                                            formErrors["notes"]
                                                ? formErrors["notes"][0]
                                                : false
                                        }
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="flex flex-col gap-y-2">
                                    <Button color="dark">Place Order</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PlaceOrder;
