import { CartItemType } from "@type/cartType";
import { FC } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import useCart from "../../hooks/useCart";
const CartTableBody: FC<{ cartProduct: CartItemType }> = ({ cartProduct }) => {
    // destructure product data
    const { name, image } = cartProduct?.product;

    const { deleteCartItem, updateCartItem } = useCart();

    return (
        <tr className="border">
            <td className="p-2 mx-auto !w-[350px]">
                <div className="flex items-center justify-start gap-5">
                    <img
                        src={image}
                        alt={name}
                        className="w-[80px] h-[80px] object-cover"
                    />
                    <p className="font-semibold">{name}</p>
                </div>
            </td>
            <td className="p-2 text-center font-semibold">
                ৳ {(cartProduct?.price).toFixed(2)}
            </td>
            <td className="p-2 text-center">
                <div className="flex items-center justify-center">
                    <button
                        className="px-4 py-3 border bg-gray-200 hover:bg-gray-300 hover:duration-300 rounded-l-md"
                        onClick={() =>
                            updateCartItem(
                                cartProduct?.id,
                                cartProduct?.qty - 1
                            )
                        }
                        disabled={cartProduct?.qty === 1}
                    >
                        <AiOutlineMinus />
                    </button>
                    <span className="w-12 text-center border-none bg-gray-200 outline-none py-[9px]">
                        {cartProduct.qty}
                    </span>
                    <button
                        className="px-4 py-3 border bg-gray-200 hover:bg-gray-300 hover:duration-300 rounded-r-md"
                        onClick={() =>
                            updateCartItem(
                                cartProduct?.id,
                                cartProduct?.qty + 1
                            )
                        }
                    >
                        <AiOutlinePlus />
                    </button>
                </div>
            </td>
            <td className="p-2 text-center font-semibold">
                ৳ {(cartProduct?.total).toFixed(2)}
            </td>
            <td className="p-2 text-center">
                <button
                    onClick={() => deleteCartItem(cartProduct?.id)}
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
