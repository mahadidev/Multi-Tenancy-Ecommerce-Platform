import { ThemeWidgetPropsType } from "@type/themeType";
import {
    Button,
    Card,
    Label,
    Select,
    Textarea,
    TextInput,
} from "flowbite-react";
import { useAtom } from "jotai";
import { FC, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import useCart from "../../hooks/useCart";
import useForm from "../../hooks/useForm";
import { cartAtom } from "../../store/cart.atom";

const PlaceOrder: FC<ThemeWidgetPropsType> = () => {
    const [cartItems] = useAtom(cartAtom);
    const { placeOrder, isLoading, fetchCartItems } = useCart();

    useEffect(() => {
        fetchCartItems();
    }, []);

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
                    <div className="lg:w-4/12">
                        {isLoading ? (
                            <Card className="animate-pulse p-4 space-y-4">
                                <div className="space-y-2">
                                    {new Array(5)
                                        .fill(5)
                                        .map((_, idx: number) => (
                                            <div
                                                key={idx}
                                                className="h-20 w-full bg-gray-300 rounded"
                                            ></div>
                                        ))}
                                </div>
                            </Card>
                        ) : (
                            <Card>
                                <div>
                                    {cartItems?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 my-2"
                                        >
                                            <div className="w-2/12">
                                                <img
                                                    src={item?.product?.image}
                                                    alt={item?.product?.name}
                                                    width={80}
                                                    height={80}
                                                    className="h-[80px] object-cover rounded-md"
                                                />
                                            </div>
                                            <div className="w-10/12">
                                                <h3 className="text-lg font-medium">
                                                    {item?.product?.name}
                                                </h3>
                                                <p className="text-md text-gray-600 font-medium">
                                                    Quantity: {item?.qty}
                                                </p>
                                                <p className="text-md text-gray-600 font-medium">
                                                    Price: {item?.total}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <hr />
                                <div>
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-left">
                                            Sub-Total
                                        </span>
                                        <span className="text-right">
                                            {cartItems
                                                .reduce(
                                                    (sum, item) =>
                                                        sum + item.total,
                                                    0
                                                )
                                                .toFixed(2)}{" "}
                                            BDT
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-left">
                                            Delivery Charges
                                        </span>
                                        <span className="text-right">
                                            120.00 BDT
                                        </span>
                                    </div>

                                    <div className="flex justify-between font-bold mt-2">
                                        <span className="text-left">
                                            Total Amount
                                        </span>
                                        <span className="text-right">
                                            {cartItems
                                                .reduce(
                                                    (sum, item) =>
                                                        sum + item.total,
                                                    120
                                                )
                                                .toFixed(2)}{" "}
                                            BDT
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                    <div className="lg:w-8/12">
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
                                    <Button
                                        color="dark"
                                        onClick={() => {
                                            placeOrder({
                                                ...formState,
                                            });
                                        }}
                                        // isProcessing={placeOrder.isLoading}
                                        disabled={
                                            !formState["name"] ||
                                            !formState["email"] ||
                                            !formState["phone"] ||
                                            !formState["payment_method"]
                                        }
                                        processingLabel="Creating"
                                        processingSpinner={
                                            <AiOutlineLoading className="animate-spin" />
                                        }
                                    >
                                        Place Order
                                    </Button>
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
