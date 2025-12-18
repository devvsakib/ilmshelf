import { useEffect, useState } from "react";

export function useCart() {
    const [cart, setCart] = useState(() =>
        JSON.parse(localStorage.getItem("cart")) || []
    );

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => {
            const found = prev.find((p) => p.id === product.id);
            if (found) {
                return prev.map((p) =>
                    p.id === product.id ? { ...p, qty: p.qty + 1 } : p
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) =>
        setCart(cart.filter((p) => p.id !== id));

    return { cart, addToCart, removeFromCart };
}
