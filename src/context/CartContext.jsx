import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem("leaf_clay_cart");
            return saved ? JSON.parse(saved) : [
                // Start with a friendly default item to showcase cart functionality
                {
                    id: "mini-bonsai-tree",
                    product: {
                        id: "mini-bonsai-tree",
                        name: "Japanese Juniper Bonsai",
                        botanicalName: "Juniperus procumbens 'Nana'",
                        category: "Bonsai",
                        price: 2500,
                        image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80",
                        badge: "Best Seller"
                    },
                    quantity: 1
                }
            ];
        } catch {
            return [];
        }
    });

    const [couponCode, setCouponCode] = useState("");
    const [discountRate, setDiscountRate] = useState(0);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem("leaf_clay_cart", JSON.stringify(cart));
        } catch (e) {
            console.error("Failed to save cart to localStorage", e);
        }
    }, [cart]);

    const showToast = (message, type = "success") => {
        setToast({ message, type, id: Date.now() });
        setTimeout(() => {
            setToast((current) => (current && current.id ? null : current));
        }, 3200);
    };

    const addToCart = (product, quantity = 1) => {
        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                };
                return updated;
            }
            return [...prev, { id: product.id, product, quantity }];
        });
        showToast(`Added ${quantity}x "${product.name}" to cart! 🌿`);
    };

    const updateQuantity = (productId, newQty) => {
        if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity: newQty } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        const itemToRemove = cart.find((i) => i.id === productId);
        setCart((prev) => prev.filter((item) => item.id !== productId));
        if (itemToRemove) {
            showToast(`Removed "${itemToRemove.product.name}" from cart`);
        }
    };

    const clearCart = () => {
        setCart([]);
        setCouponCode("");
        setDiscountRate(0);
    };

    const applyCoupon = (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === "LEAF15") {
            setCouponCode("LEAF15");
            setDiscountRate(0.15);
            showToast("Promo code LEAF15 applied! 15% discount saved 🎉");
            return { success: true, message: "15% discount applied successfully!" };
        } else if (clean === "WELCOME10") {
            setCouponCode("WELCOME10");
            setDiscountRate(0.10);
            showToast("Welcome coupon applied! 10% discount saved 🎉");
            return { success: true, message: "10% discount applied successfully!" };
        } else {
            showToast("Invalid promo code. Try LEAF15", "error");
            return { success: false, message: "Invalid promo code. Try LEAF15" };
        }
    };

    const removeCoupon = () => {
        setCouponCode("");
        setDiscountRate(0);
        showToast("Coupon removed");
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const discountAmount = Math.round(cartSubtotal * discountRate);
    const freeShippingThreshold = 3500;
    const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 350;
    const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                cartCount,
                cartSubtotal,
                shippingFee,
                discountAmount,
                discountRate,
                couponCode,
                applyCoupon,
                removeCoupon,
                cartTotal,
                freeShippingThreshold,
                toast,
                showToast
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
