import { ProductType } from "@type/productType";
import { Carousel, Modal } from "flowbite-react";
import { FC, useState } from "react";
import {
    AiOutlineArrowLeft,
    AiOutlineArrowRight,
    AiOutlineEye,
    AiOutlineHeart,
    AiOutlineMinus,
    AiOutlinePlus,
    AiOutlineShareAlt,
    AiOutlineShoppingCart,
    AiOutlineTag,
} from "react-icons/ai";

interface ProductQuickViewPropsType {
    product: ProductType;
}

const ProductQuickViewModal: FC<ProductQuickViewPropsType> = ({ product }) => {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedSize, setSelectSize] = useState<string>("");

    const carouselImages = [
        "https://i.ibb.co.com/BKj3QMXn/p-19-1.webp",
        "https://i.ibb.co.com/nqC0XG6p/p-19-2.webp",
        "https://i.ibb.co.com/vvrP0Lwk/p-19-3.webp",
    ];
    return (
        <>
            {/* <button
                className="inline-flex items-center justify-center w-8 h-8 text-xl rounded-full bg-[#02b290] hover:bg-[#4cb49f] hover:duration-300 text-white lg:w-10 lg:h-10 focus:outline-none"
                aria-label="Quick View"
                onClick={() => setOpen(true)}
            >
                <FiEye />
            </button> */}

            <button
                className="p-2 rounded-md bg-gray-100 hover:bg-[#02b290] hover:text-white transition"
                title="Quick View"
                onClick={() => setOpen(true)}
            >
                <AiOutlineEye />
            </button>
            <Modal onClose={() => setOpen(false)} show={isOpen} size="7xl">
                <Modal.Header>Product Quick View</Modal.Header>
                <Modal.Body>
                    <div className="px-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Slider */}
                        <div className="h-[400px] md:h-auto p-3 border-solid border-[1px] border-gray-200 rounded-md">
                            <Carousel
                                leftControl={
                                    <button className="p-2 rounded-full shadow-lg bg-white hover:bg-[#4cb49f] hover:text-white hover:duration-300">
                                        <AiOutlineArrowLeft size={22} />
                                    </button>
                                }
                                rightControl={
                                    <button className="p-2 rounded-full shadow-lg bg-white hover:bg-[#4cb49f] hover:text-white hover:duration-300">
                                        <AiOutlineArrowRight size={22} />
                                    </button>
                                }
                            >
                                {carouselImages?.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt={`Product Image ${index + 1}`}
                                        className="rounded-lg"
                                    />
                                ))}
                            </Carousel>
                        </div>

                        {/* Product Info */}
                        <div className="md:p-3">
                            <h1 className="text-3xl font-semibold mb-5">
                                {product?.name}
                            </h1>
                            <p className="text-2xl font-bold mt-2">
                                {product?.discount_price
                                    ? `$${product?.discount_price} - $${product?.price}`
                                    : `$${product?.price}`}
                            </p>

                            <div className="mt-4">
                                <p className="font-semibold">Available In:</p>
                                <div className="flex gap-2 mt-2">
                                    {/* {product?.variants?.map((variant, idx) => (
                                        <button
                                            key={idx}
                                            className="border px-3 py-1 rounded-lg hover:bg-gray-200"
                                        >
                                            {variant?.label}
                                        </button>
                                    ))} */}

                                    {["S", "M", "L"].map((size) => (
                                        <button
                                            key={size}
                                            className={`font-semibold border w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-200 ${
                                                selectedSize === size &&
                                                "border-[#02b290]"
                                            }`}
                                            onClick={() => setSelectSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center items-center mt-10 border rounded-sm w-full bg-gray-200 p-2">
                                <button
                                    className="p-2 bg-gray-200 hover:bg-gray-300 hover:duration-300"
                                    onClick={() =>
                                        setQuantity((q) => Math.max(1, q - 1))
                                    }
                                >
                                    <AiOutlineMinus size={26} />
                                </button>
                                <span className="px-4 text-xl font-semibold">
                                    {quantity}
                                </span>
                                <button
                                    className="p-2 bg-gray-200 hover:bg-gray-300 hover:duration-300"
                                    onClick={() => setQuantity((q) => q + 1)}
                                >
                                    <AiOutlinePlus size={26} />
                                </button>
                            </div>

                            <button className="flex justify-center items-center gap-2 bg-[#02b290] hover:bg-[#4cb49f] text-white px-6 py-3 rounded-sm mt-4 w-full">
                                <AiOutlineShoppingCart size={30} /> Add to Cart
                            </button>

                            <div className="flex gap-4 mt-4">
                                <button className="flex items-center gap-2 border px-4 py-3 rounded-lg w-full justify-center">
                                    <AiOutlineHeart size={30} /> Wishlist
                                </button>
                                <button className="flex items-center gap-2 border px-4 py-3 rounded-lg w-full justify-center">
                                    <AiOutlineShareAlt size={30} /> Share
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mt-4 text-gray-600">
                                <AiOutlineTag size={30} />
                                {[
                                    "Fast Food",
                                    "Organic Potato",
                                    "Flavoured",
                                    "Dry Food",
                                ].map((tag) => (
                                    <span
                                        key={tag}
                                        className="border px-2 py-1 rounded-sm text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-10">
                                <h2 className="font-semibold text-xl text-black">
                                    Product Details:
                                </h2>
                                <p className="text-gray-600 text-sm mt-2">
                                    {product?.short_description || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                  <Button
                      color="primary"
                      onClick={() => {
                          create.submit({
                              formData: formState,
                              onSuccess: () => {
                                  setOpen(false);
                              },
                          });
                          setFormState({});
                      }}
                      isProcessing={create.isLoading}
                      disabled={create.isLoading}
                      processingLabel="Creating"
                      processingSpinner={
                          <AiOutlineLoading className="animate-spin" />
                      }
                  >
                      Create
                  </Button>
              </Modal.Footer> */}
            </Modal>
        </>
    );
};

export default ProductQuickViewModal;
