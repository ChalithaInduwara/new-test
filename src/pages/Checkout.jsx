import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
    CreditCard,
    Truck,
    Banknote,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    Leaf,
    Lock,
    ChevronRight
} from "lucide-react";

function Checkout() {
    const {
        cart,
        cartSubtotal,
        shippingFee: baseShippingFee,
        discountAmount,
        couponCode,
        clearCart
    } = useCart();
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        email: "dilshan.perera@example.com",
        phone: "+94 77 123 4567",
        firstName: "Dilshan",
        lastName: "Perera",
        address: "45/2 Lotus Grove, Havelock Road",
        city: "Colombo 05",
        postalCode: "00500",
        notes: "Please call upon arrival at the gate."
    });

    const [shippingMethod, setShippingMethod] = useState("standard");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");

    // Calculate shipping based on chosen method
    const shippingCost =
        shippingMethod === "express"
            ? 650
            : shippingMethod === "eco"
            ? 400
            : baseShippingFee;

    const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            setOrderNumber(`LC-${randomNum}`);
            setIsSubmitting(false);
            setOrderComplete(true);
            clearCart();
        }, 1200);
    };

    if (cart.length === 0 && !orderComplete) {
        return (
            <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>No Items to Checkout</h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                    Your cart is currently empty. Please add some plants or pots before proceeding.
                </p>
                <Link to="/shop" className="btn btn-primary">
                    Return to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="checkout-page-wrapper">
            <div className="container">
                {/* Breadcrumbs */}
                <div className="breadcrumb-nav">
                    <Link to="/">Home</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <Link to="/cart">Cart</Link>
                    <ChevronRight size={14} className="breadcrumb-separator" />
                    <span>Secure Checkout</span>
                </div>

                <div className="cart-header-section">
                    <h1 className="cart-page-title">Safe Botanical Checkout</h1>
                    <p style={{ color: "var(--color-text-muted)" }}>
                        Enter your shipping details below. Every order is safely packed in shock-proof transit pods.
                    </p>
                </div>

                <div className="checkout-grid">
                    {/* Main Form Sections */}
                    <form onSubmit={handleSubmitOrder} className="checkout-form-column">
                        {/* 1. Contact Information */}
                        <div className="checkout-section-card">
                            <div className="checkout-section-header">
                                <span className="checkout-step-number">1</span>
                                <h2 className="checkout-section-title">Contact &amp; Notification Details</h2>
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number (For Courier)</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Delivery Address */}
                        <div className="checkout-section-card">
                            <div className="checkout-section-header">
                                <span className="checkout-step-number">2</span>
                                <h2 className="checkout-section-title">Delivery Destination</h2>
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Street Address &amp; Suite</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label htmlFor="city">City / District</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Delivery Instructions (Optional)</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows="2"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Leave at porch, call on arrival, etc."
                                />
                            </div>
                        </div>

                        {/* 3. Delivery Method */}
                        <div className="checkout-section-card">
                            <div className="checkout-section-header">
                                <span className="checkout-step-number">3</span>
                                <h2 className="checkout-section-title">Shipping &amp; Transit Method</h2>
                            </div>

                            <div className="shipping-methods-group">
                                <label
                                    className={`shipping-method-option ${shippingMethod === "standard" ? "selected" : ""}`}
                                >
                                    <div className="shipping-method-left">
                                        <input
                                            type="radio"
                                            name="shipping"
                                            value="standard"
                                            checked={shippingMethod === "standard"}
                                            onChange={() => setShippingMethod("standard")}
                                        />
                                        <div>
                                            <div className="shipping-method-title">Standard Botanical Transit</div>
                                            <div className="shipping-method-eta">3 - 4 Business Days • Cushioned Plant Pod</div>
                                        </div>
                                    </div>
                                    <span className="shipping-method-price">
                                        {baseShippingFee === 0 ? "FREE" : `Rs. ${baseShippingFee}`}
                                    </span>
                                </label>

                                <label
                                    className={`shipping-method-option ${shippingMethod === "express" ? "selected" : ""}`}
                                >
                                    <div className="shipping-method-left">
                                        <input
                                            type="radio"
                                            name="shipping"
                                            value="express"
                                            checked={shippingMethod === "express"}
                                            onChange={() => setShippingMethod("express")}
                                        />
                                        <div>
                                            <div className="shipping-method-title">Priority Air-conditioned Express</div>
                                            <div className="shipping-method-eta">1 - 2 Business Days • Fragile Greenery Expedited</div>
                                        </div>
                                    </div>
                                    <span className="shipping-method-price">Rs. 650</span>
                                </label>

                                <label
                                    className={`shipping-method-option ${shippingMethod === "eco" ? "selected" : ""}`}
                                >
                                    <div className="shipping-method-left">
                                        <input
                                            type="radio"
                                            name="shipping"
                                            value="eco"
                                            checked={shippingMethod === "eco"}
                                            onChange={() => setShippingMethod("eco")}
                                        />
                                        <div>
                                            <div className="shipping-method-title">Eco-Friendly Carbon-Neutral Transit</div>
                                            <div className="shipping-method-eta">3 - 5 Days • 100% Recycled Biodegradable Boxes</div>
                                        </div>
                                    </div>
                                    <span className="shipping-method-price">Rs. 400</span>
                                </label>
                            </div>
                        </div>

                        {/* 4. Payment Method */}
                        <div className="checkout-section-card">
                            <div className="checkout-section-header">
                                <span className="checkout-step-number">4</span>
                                <h2 className="checkout-section-title">Payment Method</h2>
                            </div>

                            <div className="payment-methods-grid">
                                <button
                                    type="button"
                                    className={`payment-tab-btn ${paymentMethod === "card" ? "active" : ""}`}
                                    onClick={() => setPaymentMethod("card")}
                                >
                                    <CreditCard size={22} />
                                    <span>Credit / Debit Card</span>
                                </button>
                                <button
                                    type="button"
                                    className={`payment-tab-btn ${paymentMethod === "cod" ? "active" : ""}`}
                                    onClick={() => setPaymentMethod("cod")}
                                >
                                    <Banknote size={22} />
                                    <span>Cash on Delivery</span>
                                </button>
                                <button
                                    type="button"
                                    className={`payment-tab-btn ${paymentMethod === "bank" ? "active" : ""}`}
                                    onClick={() => setPaymentMethod("bank")}
                                >
                                    <Truck size={22} />
                                    <span>Direct Bank Transfer</span>
                                </button>
                            </div>

                            {paymentMethod === "card" && (
                                <div className="card-mock-form">
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="4532 •••• •••• 8892"
                                            defaultValue="4532 9800 1204 8892"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                defaultValue="08/28"
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Security Code (CVV)</label>
                                            <input
                                                type="text"
                                                placeholder="CVC"
                                                defaultValue="482"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                                        <Lock size={12} />
                                        <span>256-Bit SSL Encrypted &amp; PCI-DSS Compliant</span>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === "cod" && (
                                <div className="card-mock-form">
                                    <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                                        💵 <strong>Cash on Delivery:</strong> Pay safely in cash directly to our delivery courier
                                        once you inspect and unbox your plants.
                                    </p>
                                </div>
                            )}

                            {paymentMethod === "bank" && (
                                <div className="card-mock-form">
                                    <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                                        🏦 <strong>Commercial Bank of Ceylon:</strong> Account #8001293842 (Leaf &amp; Clay Ltd).
                                        Please send payment receipt via WhatsApp or hello@leafandclay.lk with order ID.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-terracotta btn-block btn-lg"
                        >
                            {isSubmitting ? (
                                <span>Securing Your Plant Reservation...</span>
                            ) : (
                                <>
                                    <span>Place Order • Rs. {grandTotal.toLocaleString()}</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Order Review Sidebar */}
                    <div className="checkout-review-column">
                        <div className="order-summary-card">
                            <h3 className="summary-heading">Order Items ({cart.length})</h3>

                            <div style={{ marginBottom: "1.25rem" }}>
                                {cart.map((item) => (
                                    <div key={item.id} className="checkout-mini-item">
                                        <img src={item.product.image} alt={item.product.name} />
                                        <div style={{ flex: 1 }}>
                                            <div className="checkout-mini-title">{item.product.name}</div>
                                            <div className="checkout-mini-qty">
                                                Qty: {item.quantity} × Rs. {item.product.price.toLocaleString()}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                                            Rs. {(item.product.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>Rs. {cartSubtotal.toLocaleString()}</span>
                            </div>

                            <div className="summary-row">
                                <span>Shipping Fee</span>
                                <span>
                                    {shippingCost === 0 ? (
                                        <strong style={{ color: "#257a46" }}>FREE</strong>
                                    ) : (
                                        `Rs. ${shippingCost.toLocaleString()}`
                                    )}
                                </span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="summary-row" style={{ color: "var(--color-terracotta)" }}>
                                    <span>Discount ({couponCode})</span>
                                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="summary-row summary-row-bold">
                                <span>Total Payable</span>
                                <span>Rs. {grandTotal.toLocaleString()}</span>
                            </div>

                            <div className="botanical-guarantee-box" style={{ marginTop: "1rem" }}>
                                <div className="guarantee-point">
                                    <ShieldCheck size={16} />
                                    <span>100% Live Arrival Safe Transit Guarantee</span>
                                </div>
                                <div className="guarantee-point">
                                    <Leaf size={16} />
                                    <span>Potted in Organic Nourishing Substrate</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ORDER CONFIRMATION MODAL */}
            {orderComplete && (
                <div className="order-modal-backdrop">
                    <div className="order-modal-card">
                        <div className="order-success-icon">
                            <CheckCircle2 size={42} />
                        </div>
                        <h2 className="order-modal-title">Thank You for Your Order!</h2>
                        <span className="order-modal-num">Order Reference: {orderNumber}</span>

                        <p className="order-modal-desc">
                            We have received your botanical reservation! Our nursery specialists are hand-inspecting,
                            hydrating, and securing your plants into custom shock-absorbent transit pods. A confirmation
                            email has been dispatched to <strong>{formData.email}</strong>.
                        </p>

                        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                            <button
                                onClick={() => navigate("/shop")}
                                className="btn btn-primary"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="btn btn-outline"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Checkout;
