import React, { createContext, useContext, useState, useEffect } from "react";
import {
    INITIAL_ORDERS,
    INITIAL_COUPONS,
    INITIAL_MESSAGES,
    INITIAL_SITE_SETTINGS
} from "../data/initialAdminData";

const StoreContext = createContext();

const STORAGE_KEYS = {
    ORDERS: "leaf_clay_orders_v1",
    COUPONS: "leaf_clay_coupons_v1",
    MESSAGES: "leaf_clay_messages_v1",
    SETTINGS: "leaf_clay_settings_v1",
    ADMIN_AUTH: "leaf_clay_admin_auth_v1"
};

export function StoreProvider({ children }) {
    // -------------------------------------------------------------------------
    // Orders State
    // -------------------------------------------------------------------------
    const [orders, setOrders] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
            return saved ? JSON.parse(saved) : INITIAL_ORDERS;
        } catch (e) {
            console.error("Failed to parse orders from localStorage", e);
            return INITIAL_ORDERS;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        } catch (e) {
            console.error("Failed to save orders to localStorage", e);
        }
    }, [orders]);

    // -------------------------------------------------------------------------
    // Coupons State
    // -------------------------------------------------------------------------
    const [coupons, setCoupons] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
            return saved ? JSON.parse(saved) : INITIAL_COUPONS;
        } catch (e) {
            console.error("Failed to parse coupons from localStorage", e);
            return INITIAL_COUPONS;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
        } catch (e) {
            console.error("Failed to save coupons to localStorage", e);
        }
    }, [coupons]);

    // -------------------------------------------------------------------------
    // Messages / Inquiries State
    // -------------------------------------------------------------------------
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
            return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
        } catch (e) {
            console.error("Failed to parse messages from localStorage", e);
            return INITIAL_MESSAGES;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
        } catch (e) {
            console.error("Failed to save messages to localStorage", e);
        }
    }, [messages]);

    // -------------------------------------------------------------------------
    // Site Settings State
    // -------------------------------------------------------------------------
    const [siteSettings, setSiteSettings] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            return saved ? { ...INITIAL_SITE_SETTINGS, ...JSON.parse(saved) } : INITIAL_SITE_SETTINGS;
        } catch (e) {
            console.error("Failed to parse settings from localStorage", e);
            return INITIAL_SITE_SETTINGS;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
        } catch (e) {
            console.error("Failed to save settings to localStorage", e);
        }
    }, [siteSettings]);

    // -------------------------------------------------------------------------
    // Admin Auth State (session/remembered)
    // -------------------------------------------------------------------------
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
            return saved === "true";
        } catch {
            return false;
        }
    });

    const loginAdmin = (password = "") => {
        // Allow instant login for demo (or password check)
        setIsAdminAuthenticated(true);
        try {
            localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
        } catch (e) {
            console.warn(e);
        }
        return true;
    };

    const logoutAdmin = () => {
        setIsAdminAuthenticated(false);
        try {
            localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
        } catch (e) {
            console.warn(e);
        }
    };

    // =========================================================================
    // ORDERS CRUD
    // =========================================================================
    const createOrder = (orderData) => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newOrder = {
            id: orderData.id || `LC-${randomNum}`,
            date: new Date().toISOString(),
            status: orderData.status || "Pending",
            trackingNumber: orderData.trackingNumber || "",
            adminNotes: orderData.adminNotes || "New customer order placed online.",
            items: orderData.items || [],
            subtotal: orderData.subtotal || 0,
            discountAmount: orderData.discountAmount || 0,
            couponCode: orderData.couponCode || "",
            shippingFee: orderData.shippingFee ?? siteSettings.standardShippingFee,
            shippingMethod: orderData.shippingMethod || "standard",
            total: orderData.total || 0,
            paymentMethod: orderData.paymentMethod || "card",
            customer: {
                firstName: orderData.customer?.firstName || "Customer",
                lastName: orderData.customer?.lastName || "",
                email: orderData.customer?.email || "",
                phone: orderData.customer?.phone || "",
                address: orderData.customer?.address || "",
                city: orderData.customer?.city || "Colombo",
                postalCode: orderData.customer?.postalCode || "",
                notes: orderData.customer?.notes || ""
            }
        };

        // Increment coupon usage if used
        if (newOrder.couponCode) {
            incrementCouponUsage(newOrder.couponCode);
        }

        setOrders((prev) => [newOrder, ...prev]);
        return newOrder;
    };

    const updateOrder = (orderId, updatedFields) => {
        setOrders((prev) =>
            prev.map((order) => {
                if (order.id === orderId) {
                    return {
                        ...order,
                        ...updatedFields,
                        customer: {
                            ...order.customer,
                            ...(updatedFields.customer || {})
                        }
                    };
                }
                return order;
            })
        );
    };

    const updateOrderStatus = (orderId, newStatus) => {
        updateOrder(orderId, { status: newStatus });
    };

    const deleteOrder = (orderId) => {
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
    };

    // =========================================================================
    // COUPONS CRUD
    // =========================================================================
    const addCoupon = (couponData) => {
        const cleanCode = couponData.code.trim().toUpperCase();
        if (!cleanCode) return { success: false, message: "Coupon code is required" };

        const exists = coupons.some((c) => c.code.toUpperCase() === cleanCode);
        if (exists) {
            return { success: false, message: `Coupon ${cleanCode} already exists` };
        }

        const newCoupon = {
            code: cleanCode,
            discountPercent: Number(couponData.discountPercent) || 10,
            type: couponData.type || "percentage",
            minSpend: Number(couponData.minSpend) || 0,
            usageCount: 0,
            isActive: couponData.isActive !== false,
            description: couponData.description || `${couponData.discountPercent}% discount code`
        };

        setCoupons((prev) => [newCoupon, ...prev]);
        return { success: true, message: `Coupon ${cleanCode} created successfully!` };
    };

    const updateCoupon = (oldCode, updatedFields) => {
        const newCode = (updatedFields.code || oldCode).trim().toUpperCase();
        setCoupons((prev) =>
            prev.map((coupon) => {
                if (coupon.code === oldCode) {
                    return {
                        ...coupon,
                        ...updatedFields,
                        code: newCode,
                        discountPercent: Number(updatedFields.discountPercent ?? coupon.discountPercent),
                        minSpend: Number(updatedFields.minSpend ?? coupon.minSpend)
                    };
                }
                return coupon;
            })
        );
        return { success: true };
    };

    const toggleCouponStatus = (code) => {
        setCoupons((prev) =>
            prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
        );
    };

    const deleteCoupon = (code) => {
        setCoupons((prev) => prev.filter((c) => c.code !== code));
    };

    const incrementCouponUsage = (code) => {
        const clean = code.trim().toUpperCase();
        setCoupons((prev) =>
            prev.map((c) =>
                c.code.toUpperCase() === clean
                    ? { ...c, usageCount: (c.usageCount || 0) + 1 }
                    : c
            )
        );
    };

    const validateCoupon = (code, subtotal = 0) => {
        if (!code || !code.trim()) {
            return { valid: false, message: "Please enter a promo code" };
        }
        const clean = code.trim().toUpperCase();
        const found = coupons.find((c) => c.code.toUpperCase() === clean);

        if (!found) {
            return { valid: false, message: `Invalid code "${clean}". Try LEAF15` };
        }
        if (!found.isActive) {
            return { valid: false, message: `Coupon "${clean}" is currently disabled or expired` };
        }
        if (found.minSpend && subtotal < found.minSpend) {
            return {
                valid: false,
                message: `Minimum order of Rs. ${found.minSpend.toLocaleString()} required for "${clean}"`
            };
        }

        const discountRate = found.type === "fixed" ? 0 : found.discountPercent / 100;
        const fixedAmount = found.type === "fixed" ? found.discountPercent : 0;

        return {
            valid: true,
            coupon: found,
            discountRate,
            fixedAmount,
            message: `Coupon "${clean}" applied! (${found.type === "fixed" ? `Rs. ${found.discountPercent}` : `${found.discountPercent}%`} off)`
        };
    };

    // =========================================================================
    // MESSAGES / INQUIRIES CRUD
    // =========================================================================
    const createMessage = (msgData) => {
        const newMsg = {
            id: `msg-${Date.now()}`,
            date: new Date().toISOString(),
            name: msgData.name || "Anonymous",
            email: msgData.email || "",
            subject: msgData.subject || "care",
            message: msgData.message || "",
            status: "unread",
            replyNote: ""
        };
        setMessages((prev) => [newMsg, ...prev]);
        return newMsg;
    };

    const updateMessage = (id, fields) => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, ...fields } : msg))
        );
    };

    const markMessageStatus = (id, newStatus) => {
        updateMessage(id, { status: newStatus });
    };

    const deleteMessage = (id) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

    // =========================================================================
    // SITE SETTINGS CRUD & BACKUP
    // =========================================================================
    const updateSiteSettings = (newSettings) => {
        setSiteSettings((prev) => ({
            ...prev,
            ...newSettings
        }));
    };

    const resetAllToFactoryDefaults = (resetProductsCallback) => {
        try {
            localStorage.removeItem(STORAGE_KEYS.ORDERS);
            localStorage.removeItem(STORAGE_KEYS.COUPONS);
            localStorage.removeItem(STORAGE_KEYS.MESSAGES);
            localStorage.removeItem(STORAGE_KEYS.SETTINGS);
            localStorage.removeItem("leaf_clay_products_v1");
            localStorage.removeItem("leaf_clay_categories_v1");

            setOrders(INITIAL_ORDERS);
            setCoupons(INITIAL_COUPONS);
            setMessages(INITIAL_MESSAGES);
            setSiteSettings(INITIAL_SITE_SETTINGS);

            if (typeof resetProductsCallback === "function") {
                resetProductsCallback();
            }
            return true;
        } catch (e) {
            console.error("Failed to reset demo data", e);
            return false;
        }
    };

    return (
        <StoreContext.Provider
            value={{
                // Orders
                orders,
                createOrder,
                updateOrder,
                updateOrderStatus,
                deleteOrder,

                // Coupons
                coupons,
                addCoupon,
                updateCoupon,
                deleteCoupon,
                toggleCouponStatus,
                validateCoupon,

                // Messages
                messages,
                createMessage,
                updateMessage,
                markMessageStatus,
                deleteMessage,

                // Settings
                siteSettings,
                updateSiteSettings,
                resetAllToFactoryDefaults,

                // Auth
                isAdminAuthenticated,
                loginAdmin,
                logoutAdmin
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
