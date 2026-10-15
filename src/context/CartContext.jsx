import React, { createContext, useContext, useState, useEffect } from "react";
import { useStore } from "./StoreContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { siteSettings, validateCoupon } = useStore();

    const CART_STORAGE_KEY = "leaf_clay_cart_v3";

    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [couponCode, setCouponCode] = useState("");
    const [discountRate, setDiscountRate] = useState(0);
    const [fixedDiscount, setFixedDiscount] = useState(0);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
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
        setFixedDiscount(0);
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = cart.reduce(
        (sum, item) => sum + (Number(item.product.price) || 0) * item.quantity,
        0
    );

    const applyCoupon = (code) => {
        const result = validateCoupon(code, cartSubtotal);
        if (result.valid) {
            setCouponCode(result.coupon.code);
            setDiscountRate(result.discountRate);
            setFixedDiscount(result.fixedAmount);
            showToast(result.message, "success");
            return { success: true, message: result.message };
        } else {
            showToast(result.message, "error");
            return { success: false, message: result.message };
        }
    };

    const removeCoupon = () => {
        setCouponCode("");
        setDiscountRate(0);
        setFixedDiscount(0);
        showToast("Coupon removed");
    };

    const discountAmount = Math.round(cartSubtotal * discountRate) + fixedDiscount;
    const freeShippingThreshold = siteSettings?.freeShippingThreshold ?? 3500;
    const baseShippingFee = siteSettings?.standardShippingFee ?? 350;
    const shippingFee =
        cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : baseShippingFee;
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
