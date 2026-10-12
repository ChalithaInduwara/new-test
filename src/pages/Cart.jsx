import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
    Trash2,
    ArrowRight,
    ShoppingBag,
    CheckCircle2,
    Sparkles,
    ShieldCheck,
    ChevronRight
} from "lucide-react";

function Cart() {
    const {
        cart,
        updateQuantity,
        removeFromCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        discountAmount,
        couponCode,
        applyCoupon,
        removeCoupon,
        cartTotal,
        freeShippingThreshold
    } = useCart();

    const [inputCoupon, setInputCoupon] = useState("");

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (inputCoupon.trim()) {
            applyCoupon(inputCoupon);
            setInputCoupon("");
        }
    };

    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
    const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

    if (cart.length === 0) {
        return (
            <div className="container">
                <div className="cart-empty-view">
                    <div className="cart-empty-icon">
                        <ShoppingBag size={38} />
                    </div>
                    <h2 className="cart-empty-title">Your Plant Cart is Empty</h2>
                    <p className="cart-empty-desc">
                        Looks like you haven't chosen any green companions yet. Explore our handcrafted bonsai,
                        cacti, and ceramic pots to bring natural calm into your home.
                    </p>
                    <Link to="/shop" className="btn btn-primary btn-lg">
                        <span>Browse Plants &amp; Pots</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-wrapper">
            <div className="container">
                {/* Breadcrumbs */}
                <div className="breadcrumb-nav">
                    <Link to="/">Home</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span>Cart ({cartCount} items)</span>
                </div>

                <div className="cart-header-section">
                    <h1 className="cart-page-title">Your Botanical Cart</h1>
                    <p style={{ color: "var(--color-text-muted)" }}>
                        Review your selected plants and artisanal planters before proceeding to secure checkout.
                    </p>
                </div>

                {/* Free Shipping Progress Card */}
                <div className="free-shipping-card">
                    <div className="free-shipping-text-row">
                        {amountNeededForFreeShipping > 0 ? (
                            <span>
                                Add <strong>Rs. {amountNeededForFreeShipping.toLocaleString()}</strong> more to unlock <strong>FREE Express Shipping</strong>!
                            </span>
                        ) : (
                            <span className="shipping-unlocked">
                                <CheckCircle2 size={18} />
                                <strong>You've unlocked FREE Express Botanical Shipping!</strong>
                            </span>
                        )}
                        <span>{Math.round(freeShippingProgress)}%</span>
                    </div>
                    <div className="free-shipping-track">
                        <div
                            className="free-shipping-fill"
                            style={{ width: `${freeShippingProgress}%` }}
                        />
                    </div>
                </div>

                {/* 2-Column Cart Layout */}
                <div className="cart-grid-layout">
                    {/* Items List */}
                    <div className="cart-items-list">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item-row">
                                <Link to={`/product/${item.id}`} className="cart-item-image">
                                    <img src={item.product.image} alt={item.product.name} />
                                </Link>

                                <div className="cart-item-info">
                                    <Link to={`/product/${item.id}`}>
                                        <h3 className="cart-item-title">{item.product.name}</h3>
                                    </Link>
                                    <span className="cart-item-botanical">
                                        {item.product.botanicalName}
                                    </span>
                                    <span className="cart-item-unit-price">
                                        Rs. {item.product.price.toLocaleString()} each
                                    </span>
                                </div>

                                {/* Quantity Stepper */}
                                <div className="quantity-stepper">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="stepper-btn"
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <span className="stepper-count">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="stepper-btn"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Total & Remove */}
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div className="cart-item-total">
                                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="cart-item-remove-btn"
                                        title="Remove item"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="order-summary-card">
                        <h3 className="summary-heading">Order Summary</h3>

                        <div className="summary-row">
                            <span>Subtotal ({cartCount} items)</span>
                            <span>Rs. {cartSubtotal.toLocaleString()}</span>
                        </div>

                        <div className="summary-row">
                            <span>Botanical Transit &amp; Packaging</span>
                            <span>
                                {shippingFee === 0 ? (
                                    <strong style={{ color: "#257a46" }}>FREE</strong>
                                ) : (
                                    `Rs. ${shippingFee.toLocaleString()}`
                                )}
                            </span>
                        </div>

                        {discountAmount > 0 && (
                            <div className="summary-row" style={{ color: "var(--color-terracotta)" }}>
                                <span>Discount ({couponCode})</span>
                                <span>- Rs. {discountAmount.toLocaleString()}</span>
                            </div>
                        )}

                        {/* Promo Code Input */}
                        <div className="coupon-box">
                            {couponCode ? (
                                <div className="coupon-active-badge">
                                    <span>
                                        <Sparkles size={14} style={{ display: "inline", marginRight: "4px" }} />
                                        Code <strong>{couponCode}</strong> applied
                                    </span>
                                    <span onClick={removeCoupon} className="coupon-remove-link">
                                        Remove
                                    </span>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="coupon-input-group">
                                    <input
                                        type="text"
                                        placeholder="Promo code (e.g. LEAF15)"
                                        value={inputCoupon}
                                        onChange={(e) => setInputCoupon(e.target.value)}
                                        className="coupon-input"
                                    />
                                    <button type="submit" className="coupon-apply-btn">
                                        Apply
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="summary-row summary-row-bold">
                            <span>Estimated Total</span>
                            <span>Rs. {cartTotal.toLocaleString()}</span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary btn-block btn-lg" style={{ marginBottom: "1rem" }}>
                            <span>Proceed to Checkout</span>
                            <ArrowRight size={18} />
                        </Link>

                        <div style={{ textAlign: "center" }}>
                            <Link to="/shop" style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", textDecoration: "underline" }}>
                                or Continue Shopping
                            </Link>
                        </div>

                        <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border-subtle)", display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                            <ShieldCheck size={18} style={{ color: "var(--color-sage)" }} />
                            <span>14-day plant transit warranty &amp; SSL encrypted payment.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
