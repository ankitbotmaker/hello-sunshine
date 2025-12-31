import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Course } from "@/data/courses";

interface CartItem extends Course {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: number) => void;
  clearCart: () => void;
  isInCart: (courseId: number) => boolean;
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (course: Course) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === course.id);
      if (exists) return prev;
      return [...prev, { ...course, quantity: 1 }];
    });
  };

  const removeFromCart = (courseId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== courseId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (courseId: number) => {
    return items.some((item) => item.id === courseId);
  };

  const totalItems = items.length;

  const totalPrice = items.reduce((acc, item) => acc + item.currentPrice, 0);

  const totalSavings = items.reduce(
    (acc, item) => acc + (item.originalPrice - item.currentPrice),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        totalItems,
        totalPrice,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
