export const getCartLocalStorage = () => {
  const storagedCart = localStorage.getItem("@RocketShoes:cart");
  if (storagedCart) {
    return JSON.parse(storagedCart);
  }
  return [];
};
