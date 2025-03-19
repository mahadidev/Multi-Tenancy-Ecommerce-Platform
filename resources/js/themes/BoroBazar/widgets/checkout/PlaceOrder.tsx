import { ThemeWidgetPropsType } from "@type/themeType";
import { FC } from "react";

const PlaceOrder: FC<ThemeWidgetPropsType> = () => {
    return (
        <div className="container mx-auto">
            <div className="gi-checkout-wrap mb-8 pb-6">
                <div className="gi-checkout-block gi-check-bill">
                    <h3 className="gi-checkout-title">Billing Details</h3>
                    <div className="gi-bl-block-content">
                        <div className="gi-check-subtitle">
                            Checkout Options
                        </div>
                        <span className="gi-bill-option">
                            <span>
                                <input
                                    id="bill1"
                                    disabled
                                    type="radio"
                                    value="use"
                                    name="radio-group"
                                />
                                <label htmlFor="bill1">
                                    I want to use an existing address
                                </label>
                            </span>
                            <span>
                                <input
                                    id="bill2"
                                    type="radio"
                                    value="new"
                                    defaultChecked
                                    name="radio-group"
                                />
                                <label htmlFor="bill2">
                                    I want to use new address
                                </label>
                            </span>
                        </span>
                        <div className="gi-check-bill-form">
                            <form noValidate action="#" method="post">
                                <span className="gi-bill-wrap gi-bill-half mt-3">
                                    <label>First Name*</label>
                                    <div>
                                        <input
                                            placeholder="Enter your first name"
                                            required
                                            className="form-control"
                                            type="text"
                                            name="firstName"
                                        />
                                        <div className="invalid-feedback">
                                            Please Enter First Name.
                                        </div>
                                    </div>
                                </span>
                                <span className="gi-bill-wrap gi-bill-half mt-3">
                                    <label>Last Name*</label>
                                    <div>
                                        <input
                                            placeholder="Enter your last name"
                                            required
                                            className="form-control"
                                            type="text"
                                            name="lastName"
                                        />
                                        <div className="invalid-feedback">
                                            Please Enter Last Name.
                                        </div>
                                    </div>
                                </span>
                                <span className="gi-bill-wrap mt-3">
                                    <label>Address</label>
                                    <div>
                                        <input
                                            placeholder="Address Line 1"
                                            required
                                            className="form-control"
                                            type="text"
                                            name="address"
                                        />
                                        <div className="invalid-feedback">
                                            Please Enter Address.
                                        </div>
                                    </div>
                                </span>
                                <div className="gi-bill-wrap gi-bill-half mt-3">
                                    <label>Country</label>
                                    <span className="gi-bl-select-inner">
                                        <select
                                            name="country"
                                            required
                                            className="gi-bill-select form-select form-select-sm"
                                        >
                                            <option value="" disabled selected>
                                                Country
                                            </option>
                                            <option value="US">
                                                United States
                                            </option>
                                            <option value="CA">Canada</option>
                                            <option value="GB">
                                                United Kingdom
                                            </option>
                                            {/* Add other countries as needed */}
                                        </select>
                                    </span>
                                </div>
                                <span className="gi-bill-wrap gi-bill-half mt-3">
                                    <label>Region State</label>
                                    <div className="gi-bl-select-inner">
                                        <select
                                            name="state"
                                            required
                                            className="gi-bill-select form-select form-select-sm"
                                        >
                                            <option value="" disabled selected>
                                                Region/State
                                            </option>
                                        </select>
                                    </div>
                                </span>
                                <span className="gi-bill-wrap gi-bill-half mt-3">
                                    <label>City *</label>
                                    <div className="gi-bl-select-inner">
                                        <select
                                            name="city"
                                            required
                                            className="gi-bill-select form-select form-select-sm"
                                        >
                                            <option value="" disabled selected>
                                                City
                                            </option>
                                        </select>
                                    </div>
                                </span>
                                <span className="gi-bill-wrap gi-bill-half mt-3">
                                    <label>Post Code</label>
                                    <div>
                                        <input
                                            pattern="^\d{5,6}$"
                                            placeholder="Post Code"
                                            required
                                            className="form-control"
                                            type="text"
                                            name="postalCode"
                                        />
                                        <div className="invalid-feedback">
                                            Please Enter 05-06 digit number.
                                        </div>
                                    </div>
                                </span>
                                <span className="gi-check-order-btn">
                                    <button type="submit" className="gi-btn-2">
                                        Add
                                    </button>
                                </span>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
