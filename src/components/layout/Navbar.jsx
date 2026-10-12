import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useTheme } from "../../context/ThemeContext";
import {
    ShoppingBag,
    Search,
    Menu,
    X,
    Leaf,
    PhoneCall,
    Sparkles,
    Sun,
    Moon
} from "lucide-react";

function Navbar() {
    const { cartCount } = useCart();
    const { searchQuery, setSearchQuery } = useProducts();
    const { isDark, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate("/shop");
    };

    const navLinkClass = ({ isActive }) =>
        `nav-link ${isActive ? "nav-link-active" : ""}`;

    return (
        <header className="site-header">
            {/* Top Announcement Bar */}
            <div className="announcement-bar">
                <div className="announcement-container">
                    <div className="announcement-item">
                        <Sparkles size={14} className="announcement-icon" />
                        <span>
                            Spring Garden Sale: Use code <strong>LEAF15</strong> for 15% off your entire order!
                        </span>
                    </div>
                    <div className="announcement-right">
                        <span>🌱 100% Healthy Plant Arrival Guarantee</span>
                        <span className="announcement-divider">•</span>
                        <span>Free Shipping Over Rs. 3,500</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="navbar-container">
                <div className="nav-brand-section">
                    <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
                        <div className="brand-icon-wrapper">
                            <Leaf size={22} className="brand-leaf-icon" />
                        </div>
                        <div className="brand-text-group">
                            <span className="brand-title">Leaf &amp; Clay</span>
                            <span className="brand-tagline">Plants &amp; Decorative Pots</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Nav Links */}
                <div className="nav-links-desktop">
                    <NavLink to="/" className={navLinkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/shop" className={navLinkClass}>
                        Shop Plants
                    </NavLink>
                    <NavLink to="/about" className={navLinkClass}>
                        Our Story
                    </NavLink>
                    <NavLink to="/contact" className={navLinkClass}>
                        Contact &amp; Care
                    </NavLink>
                </div>

                {/* Right Actions */}
                <div className="nav-actions">
                    {/* Search Form */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className={`nav-search-wrapper ${showSearchInput ? "nav-search-expanded" : ""}`}
                    >
                        <Search
                            size={18}
                            className="nav-search-icon"
                            onClick={() => setShowSearchInput(!showSearchInput)}
                        />
                        <input
                            type="text"
                            placeholder="Search bonsai, cactus, pots..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="nav-search-input"
                        />
                    </form>

                    {/* Dark Mode Indicator & Toggle */}
                    <button
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                        title={`Current mode: ${isDark ? "Dark" : "Light"}. Click to toggle.`}
                    >
                        <div className="theme-toggle-track">
                            <span className={`theme-toggle-thumb ${isDark ? "thumb-dark" : "thumb-light"}`}>
                                {isDark ? <Moon size={13} className="theme-icon-moon" /> : <Sun size={13} className="theme-icon-sun" />}
                            </span>
                        </div>
                        <span className="theme-indicator-badge">
                            {isDark ? "Dark" : "Light"}
                        </span>
                    </button>

                    {/* Cart Trigger */}
                    <Link to="/cart" className="nav-cart-btn" aria-label="Shopping Cart">
                        <ShoppingBag size={20} />
                        <span className="cart-badge-counter">{cartCount}</span>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-toggle-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer Navigation */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
                    <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <div className="brand-logo">
                                <div className="brand-icon-wrapper">
                                    <Leaf size={20} className="brand-leaf-icon" />
                                </div>
                                <span className="brand-title">Leaf &amp; Clay</span>
                            </div>
                            <button
                                className="mobile-close-btn"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Mobile Theme Toggle Bar */}
                        <div className="mobile-theme-bar">
                            <span className="mobile-theme-label">Appearance:</span>
                            <button
                                className="theme-toggle-btn mobile-theme-toggle"
                                onClick={toggleTheme}
                            >
                                <div className="theme-toggle-track">
                                    <span className={`theme-toggle-thumb ${isDark ? "thumb-dark" : "thumb-light"}`}>
                                        {isDark ? <Moon size={13} /> : <Sun size={13} />}
                                    </span>
                                </div>
                                <span className="theme-indicator-badge">
                                    {isDark ? "Dark Mode" : "Light Mode"}
                                </span>
                            </button>
                        </div>

                        {/* Mobile Search */}
                        <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search plants, pots..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" onClick={() => setMobileMenuOpen(false)}>
                                Find
                            </button>
                        </form>

                        <div className="mobile-links-list">
                            <NavLink
                                to="/"
                                className={navLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>Home</span>
                            </NavLink>
                            <NavLink
                                to="/shop"
                                className={navLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>Shop Catalog</span>
                            </NavLink>
                            <NavLink
                                to="/cart"
                                className={navLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>Cart ({cartCount} items)</span>
                            </NavLink>
                            <NavLink
                                to="/checkout"
                                className={navLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>Checkout</span>
                            </NavLink>
                            <NavLink
                                to="/about"
                                className={navLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>About Us</span>
                            </NavLink>
                            <NavLink
                                to="/contact"
                                className={navLinkClass}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>Contact &amp; FAQ</span>
                            </NavLink>
                        </div>

                        <div className="mobile-footer-info">
                            <div className="mobile-contact-line">
                                <PhoneCall size={16} />
                                <span>+94 (11) 234-5678</span>
                            </div>
                            <p className="mobile-hours">Mon - Sat: 9:00 AM - 7:00 PM</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;