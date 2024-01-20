'use client'

import React, { createContext, useContext } from 'react';

type cartItem = {
  id: string;
  quantity: number;
}

interface CartContextProps {
  cart: cartItem[];
  setCart: (cart: cartItem[]) => void;
}

const globalContext = createContext<CartContextProps>({
  cart: [],
  setCart: () => {},
});

export const GlobalContextProvider = ({ children }) => {
  const [cart, setCart] = React.useState<cartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save the cart to local storage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <globalContext.Provider value={{ cart, setCart }}>
      {children}
    </globalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(globalContext);