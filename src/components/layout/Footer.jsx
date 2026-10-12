import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Leaf,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Truck,
    HeartHandshake,
    Send,
    CheckCircle2
} from "lucide-react";
import { useCart } from "../../context/CartContext";

function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const { showToast } = useCart();

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim() && email.includes("@")) {
            setSubscribed(true);
            showToast("Welcome to the Leaf & Clay club! 🌿 Check your inbox for 15% off.");
            setEmail("");
        }
    };

    return (
        <footer className="site-footer">
            {/* Value Highlights Bar */}
            <div className="footer-benefits-bar">
                <div className="benefits-container">
                    <div className="benefit-card">
                        <div className="benefit-icon-circle">
                            <Truck size={24} />
                        </div>
                        <div className="benefit-text">
                            <h4>Specialized Botanical Transit</h4>
                            <p>Cushioned shock-absorbent packaging designed specifically for fragile greenery.</p>
                        </div>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon-circle">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="benefit-text">
                            <h4>14-Day Happy Plant Guarantee</h4>
                            <p>If your plant arrives unhappy or wilts within two weeks, we replace it free.</p>
                        </div>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon-circle">
                            <HeartHandshake size={24} />
                        </div>
                        <div className="benefit-text">
                            <h4>Lifetime Care Advice</h4>
                            <p>Chat with our master botanists anytime for watering, repotting, and light tips.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="footer-main-section">
                <div className="footer-columns-container">
                    {/* Brand column */}
                    <div className="footer-col footer-col-brand">
                        <div className="brand-logo footer-brand">
                            <div className="brand-icon-wrapper">
                                <Leaf size={22} className="brand-leaf-icon" />
                            </div>
                            <span className="brand-title">Leaf &amp; Clay</span>
                        </div>
                        <p className="footer-tagline">
                            We cultivate indoor harmony by pairing hand-pruned specimen plants with artisanal
                            ceramic pottery. Built for mindful homes and vibrant workspaces.
                        </p>
                        <div className="footer-contact-items">
                            <div className="contact-item">
                                <MapPin size={16} />
                                <span>No. 42 Botanical Gardens Road, Colombo 07</span>
                            </div>
                            <div className="contact-item">
                                <Phone size={16} />
                                <span>+94 (11) 234-5678</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={16} />
                                <span>hello@leafandclay.lk</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick navigation */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Collections</h4>
                        <ul className="footer-links">
                            <li><Link to="/shop?category=Bonsai">Sculptural Bonsai</Link></li>
                            <li><Link to="/shop?category=Cactus">Architectural Cacti</Link></li>
                            <li><Link to="/shop?category=Succulents">Pastel Succulents</Link></li>
                            <li><Link to="/shop?category=Flower Pots">Ceramic Planters &amp; Pots</Link></li>
                            <li><Link to="/shop?category=Indoor Trees">Indoor Statement Trees</Link></li>
                        </ul>
                    </div>

                    {/* Customer care */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Customer Care</h4>
                        <ul className="footer-links">
                            <li><Link to="/about">Our Sustainable Mission</Link></li>
                            <li><Link to="/contact">Plant Care Assistance</Link></li>
                            <li><Link to="/cart">Review Your Cart</Link></li>
                            <li><Link to="/checkout">Fast Checkout</Link></li>
                            <li><Link to="/contact">Shipping &amp; Refund Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-col footer-col-newsletter">
                        <h4 className="footer-heading">Plant Parent Club</h4>
                        <p className="newsletter-desc">
                            Subscribe for weekly watering reminders, new rare plant drops, and an instant 15% discount code.
                        </p>
                        {subscribed ? (
                            <div className="newsletter-success">
                                <CheckCircle2 size={18} />
                                <span>Thank you for joining our green family!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="newsletter-form">
                                <div className="newsletter-input-group">
                                    <input
                                        type="email"
                                        placeholder="Your email address..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <button type="submit" aria-label="Subscribe to newsletter">
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        )}
                        <span className="newsletter-spam-note">No spam. Only plant love and propagation tips.</span>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom-bar">
                <div className="footer-bottom-container">
                    <p className="copyright-text">
                        &copy; {new Date().getFullYear()} Leaf &amp; Clay Studio. Handcrafted with botanical care. All rights reserved.
                    </p>
                    <div className="footer-bottom-badges">
                        <span>Organic Nursery Grown</span>
                        <span>•</span>
                        <span>Eco-Friendly Biodegradable Fillers</span>
                        <span>•</span>
                        <span>Sri Lankan Artisan Ceramics</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
