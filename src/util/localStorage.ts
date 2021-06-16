import { Product } from "../types";

export const getCartLocalStorage: () => Product[] = () => {
  const storagedCart = localStorage.getItem("@RocketShoes:cart");
  if (storagedCart) {
    return JSON.parse(storagedCart);
  }
  return [];
};

export const setCartLocalStorage = (products: Product[]) => {
  localStorage.setItem("@RocketShoes:cart", JSON.stringify(products));
};
