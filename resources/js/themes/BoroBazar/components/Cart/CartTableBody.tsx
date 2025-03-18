import { CartItemType } from "@type/cartType";
import { FC } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";

const CartTableBody: FC<{ cartProduct: CartItemType }> = ({ cartProduct }) => {
    // destructure product data
    const { name, thumbnail, price, discount_price, has_discount } =
        cartProduct?.product;

    const removeItem = () => {};

    return (
        <tr className="border">
            <td className="p-2 flex items-center justify-center gap-4">
                <img
                    src={thumbnail}
                    alt={name}
                    className="w-12 h-12 object-cover"
                />
                <p className="font-semibold">{name}</p>
            </td>
            <td className="p-2 text-center font-semibold">
                ৳{" "}
                {(has_discount
                    ? discount_price * cartProduct?.qty
                    : price * cartProduct?.qty
                ).toFixed(2)}
            </td>
            <td className="p-2 text-center">
                <div className="flex items-center justify-center">
                    <button
                        className="px-4 py-3 border bg-gray-200"
                        // onClick={() => updateQuantity()}
                    >
                        <AiOutlineMinus />
                    </button>
                    <input
                        type="text"
                        value={cartProduct.qty}
                        className="w-12 text-center mx-2"
                    />
                    <button
                        className="px-4 py-3 border bg-gray-200"
                        // onClick={() => updateQuantity(item.id, 1)}
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </td>
            <td className="p-2 text-center font-semibold">
                ৳{" "}
                {(has_discount
                    ? discount_price * cartProduct?.qty
                    : price * cartProduct?.qty
                ).toFixed(2)}
            </td>
            <td className="p-2 text-center">
                <button
                    onClick={() => removeItem()}
                    className="bg-red-500 !text-white p-1 rounded-md"
                >
                    <FaTimes />
                </button>
            </td>
        </tr>
    );
};

export default CartTableBody;
//   <div>
//             <div className="flex items-center justify-center h-20">
//                 <img
//                     src={thumbnail}
//                     alt="carted items thumbnail"
//                     width={80}
//                     height={80}
//                 />
//             </div>
//             <div className="table_body_item">
//                 <Link to={`/shop/singleProducts/${slug}`}>
//                     <h3 className="capitalize text-light text-black3 cursor-pointer hover:text-info_color hover:duration-300">
//                         {name}
//                     </h3>
//                 </Link>
//             </div>
//             <div className="table_body_item">
//                 ৳ {has_discount ? discount_price : price}
//             </div>
//             <div className="table_body_item">
//                 <div id="add_to_cart_area">
//                     <button
//                         id="qty_controller"
//                         // onClick={() => {
//                         //     handleUpdateCart(
//                         //         setToastOn,
//                         //         setToastType,
//                         //         setToastText,
//                         //         dispatch,
//                         //         qtyDecrease,
//                         //         _id,
//                         //         false
//                         //     );
//                         // }}
//                     >
//                         -
//                     </button>
//                     <span id="cart_qty">{cartProduct?.qty}</span>
//                     <button
//                         id="qty_controller"
//                         // onClick={() =>
//                         //     handleUpdateCart(
//                         //         setToastOn,
//                         //         setToastType,
//                         //         setToastText,
//                         //         dispatch,
//                         //         qtyIncrease,
//                         //         _id,
//                         //         true
//                         //     )
//                         // }
//                     >
//                         +
//                     </button>
//                 </div>
//             </div>
//             <div className="table_body_item">
//                 ৳{" "}
//                 {(has_discount
//                     ? discount_price * cartProduct?.qty
//                     : price * cartProduct?.qty
//                 ).toFixed(2)}
//             </div>
//             <div className="table_body_item">
//                 <span
//                     // onClick={() => handleReduceCart(_id, dispatch)}
//                     className="bg-red-500 text-white cursor-pointer text-semi_medium px-extra_padding3 !rounded-sm"
//                     id="cart_btn"
//                 >
//                     ✖
//                 </span>
//             </div>
//         </div>
