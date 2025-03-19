import { useState } from "react";

const CartSummary = () => {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [couponCode, setCouponCode] = useState("");

    return (
        <div className="gi-sidebar-wrap">
            <div className="gi-sidebar-block">
                <div className="gi-sb-title">
                    <h3 className="gi-sidebar-title">Summary</h3>
                </div>
                <div className="gi-sb-block-content">
                    <h4 className="gi-ship-title">Estimate Shipping</h4>
                    <div className="gi-cart-form">
                        <p>Enter your destination to get a shipping estimate</p>
                        <form>
                            <div className="gi-cart-wrap">
                                <label>Country *</label>
                                <div className="gi-cart-select-inner">
                                    <select
                                        name="gi_cart_country"
                                        id="gi-cart-select-country"
                                        className="gi-cart-select"
                                        value={selectedCountry}
                                        onChange={(e) =>
                                            setSelectedCountry(e.target.value)
                                        }
                                    >
                                        <option value="" disabled>
                                            Country
                                        </option>
                                        <option value="US">
                                            United States
                                        </option>
                                        <option value="GB">
                                            United Kingdom
                                        </option>
                                        <option value="CA">Canada</option>
                                        {/* Add more countries as needed */}
                                    </select>
                                </div>
                            </div>
                            <div className="gi-cart-wrap">
                                <label>State/Province</label>
                                <div className="gi-cart-select-inner">
                                    <select
                                        name="state"
                                        id="gi-select-state"
                                        className="gi-register-select"
                                        value={selectedState}
                                        onChange={(e) =>
                                            setSelectedState(e.target.value)
                                        }
                                    >
                                        <option value="" disabled>
                                            Region/State
                                        </option>
                                        {/* Add states dynamically based on country selection */}
                                    </select>
                                </div>
                            </div>
                            <div className="gi-cart-wrap">
                                <label>Zip/Postal Code</label>
                                <input
                                    type="text"
                                    name="postalcode"
                                    placeholder="Zip/Postal Code"
                                    value={postalCode}
                                    onChange={(e) =>
                                        setPostalCode(e.target.value)
                                    }
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="gi-sb-block-content">
                    <div className="gi-cart-summary-bottom">
                        <div className="gi-cart-summary">
                            <div>
                                <span className="text-left">Sub-Total</span>
                                <span className="text-right">$240.00</span>
                            </div>
                            <div>
                                <span className="text-left">
                                    Delivery Charges
                                </span>
                                <span className="text-right">$48.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-left">
                                    Coupon Discount
                                </span>
                                <span
                                    className="text-right"
                                    style={{ marginLeft: "90px" }}
                                >
                                    <a className="gi-checkout-coupon cursor-pointer">
                                        Apply Discount
                                    </a>
                                </span>
                            </div>
                            <div className="gi-cart-coupan-content">
                                <form
                                    className="gi-cart-coupan-form"
                                    onSubmit={(e) => e.preventDefault()}
                                >
                                    <input
                                        className="gi-coupan"
                                        required
                                        placeholder="Enter Your Coupon Code"
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) =>
                                            setCouponCode(e.target.value)
                                        }
                                    />
                                    <button className="gi-btn-2" type="submit">
                                        Apply
                                    </button>
                                </form>
                            </div>
                            <div className="gi-cart-summary-total">
                                <span className="text-left">Total Amount</span>
                                <span className="text-right">$288.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;
