import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartCourse {
  id: string | number;
  slug: string;
  title: string;
  image: string;
  categories: string[];
  originalPrice: number;
  currentPrice: number;
  discount: number;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  level: string;
  curriculum: { title: string; lessons: string[] }[];
  features: string[];
}

interface CartItem extends CartCourse {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (course: CartCourse) => void;
  removeFromCart: (courseId: string | number) => void;
  clearCart: () => void;
  isInCart: (courseId: string | number) => boolean;
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

  const addToCart = (course: CartCourse) => {
    setItems((prev) => {
      const exists = prev.find((item) => String(item.id) === String(course.id));
      if (exists) return prev;
      return [...prev, { ...course, quantity: 1 }];
    });
  };

  const removeFromCart = (courseId: string | number) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(courseId)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (courseId: string | number) => {
    return items.some((item) => String(item.id) === String(courseId));
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
