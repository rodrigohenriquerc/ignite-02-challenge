import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";
import { getCartLocalStorage, setCartLocalStorage } from "../util/localStorage";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    return getCartLocalStorage();
  });

  const addProduct = async (productId: number) => {
    try {
      const cartItem = cart.find((item) => item.id === productId);
      if (cartItem) {
        return updateProductAmount({ productId, amount: cartItem.amount + 1 });
      }
      const { data } = await api.get(`products/${productId}`);
      setCart([...cart, { ...data, amount: 1 }]);
      setCartLocalStorage([...cart, { ...data, amount: 1 }]);
    } catch {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const { data: productInStock }: { data: Stock } = await api.get(
        `stock/${productId}`
      );

      if (productInStock.amount <= 1) {
        throw new Error("Quantidade solicitada fora de estoque");
      }

      const { data: product } = await api.get(`products/${productId}`);
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === productId ? { ...product, amount } : cartItem
      );
      setCart(updatedCart);
      setCartLocalStorage(updatedCart);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
