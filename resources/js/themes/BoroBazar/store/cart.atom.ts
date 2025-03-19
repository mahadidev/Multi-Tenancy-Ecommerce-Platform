import { CartItemType } from "@type/cartType";
import { atom } from "jotai";

export const cartAtom = atom<CartItemType[]>([]);
