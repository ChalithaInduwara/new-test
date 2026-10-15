import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useTheme } from "../context/ThemeContext";

import { AdminDashboard } from "../components/admin/AdminDashboard";
import { AdminProducts } from "../components/admin/AdminProducts";
import { AdminCategories } from "../components/admin/AdminCategories";
import { AdminOrders } from "../components/admin/AdminOrders";
import { AdminCoupons } from "../components/admin/AdminCoupons";
import { AdminMessages } from "../components/admin/AdminMessages";
import { AdminSettings } from "../components/admin/AdminSettings";

import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingBag,
    Tag,
    MessageSquare,
    Settings,
    ExternalLink,
    Sun,
    Moon,
    Leaf,
    ShieldCheck,
    LogOut,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    UserCheck
} from "lucide-react";

export function Admin() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "dashboard";

    const {
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        currentUser
    } = useAuth();
    const { orders, messages } = useStore();
    const { isDark, toggleTheme } = useTheme();

    // Login Form State
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
    const unreadMessagesCount = messages.filter((m) => m.status === "unread").length;

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    // Auto-scroll to top when tab changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [activeTab]);

    const handleAdminLogin = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        setTimeout(() => {
            const res = adminLogin(username, password);
            setIsLoading(false);
            if (!res.success) {
                setErrorMessage(res.message || "Invalid administrator credentials. Access denied.");
            }
        }, 400);
    };

    const handleAutofillDemo = () => {
        setUsername("admin");
        setPassword("admin123");
        setErrorMessage("");
    };

    // =========================================================================
    // STRICT AUTHENTICATION GATE: DO NOT SHOW DASHBOARD UNTIL LOGGED IN
    // =========================================================================
    if (!isAdminAuthenticated) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--color-sand-light, #fcf9f5)",
                    padding: "1.5rem"
                }}
            >
                <div
                    className="admin-card"
                    style={{
                        maxWidth: "440px",
                        width: "100%",
                        padding: "2.5rem 2rem",
                        boxShadow: "var(--shadow-hover)",
                        border: "1px solid var(--color-border)"
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "var(--radius-lg, 22px)",
                                background: "linear-gradient(135deg, var(--color-forest), var(--color-moss))",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1.25rem",
                                boxShadow: "0 8px 24px rgba(27, 56, 43, 0.25)"
                            }}
                        >
                            <ShieldCheck size={32} />
                        </div>

                        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text-main)", marginBottom: "0.4rem" }}>
                            Admin Suite Login
                        </h1>
                        <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
                            Restricted area. Please sign in with administrator credentials to manage products, orders, and store settings.
                        </p>
                    </div>

                    {errorMessage && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.6rem",
                                padding: "0.85rem 1rem",
                                borderRadius: "var(--radius-md)",
                                backgroundColor: "#fee2e2",
                                color: "#b91c1c",
                                fontSize: "0.85rem",
                                marginBottom: "1.25rem",
                                lineHeight: 1.4
                            }}
                        >
                            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                        <div className="admin-form-group">
                            <label className="admin-label">Administrator Username *</label>
                            <input
                                type="text"
                                className="admin-input"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. admin"
                                autoFocus
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">Admin Password *</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="admin-input"
                                    required
                                    style={{ width: "100%", paddingRight: "2.5rem" }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter administrator password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "transparent",
                                        border: "none",
                                        color: "var(--color-text-muted)",
                                        cursor: "pointer"
                                    }}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={isLoading}
                            style={{
                                width: "100%",
                                padding: "0.85rem",
                                fontSize: "0.95rem",
                                marginTop: "0.5rem"
                            }}
                        >
                            <Lock size={16} />
                            <span>{isLoading ? "Verifying..." : "Sign In to Admin Panel"}</span>
                        </button>
                    </form>

                    {/* Demo Credentials Helper */}
                    <div
                        style={{
                            marginTop: "1.5rem",
                            padding: "0.85rem 1rem",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "var(--color-emerald-ultra-light)",
                            border: "1px dashed var(--color-mint)",
                            fontSize: "0.82rem"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                            <span style={{ fontWeight: 700, color: "var(--color-forest)" }}>Default Administrator Access:</span>
                            <button
                                type="button"
                                onClick={handleAutofillDemo}
                                className="admin-btn admin-btn-secondary admin-btn-sm"
                                style={{ padding: "0.2rem 0.5rem", fontSize: "0.72rem" }}
                            >
                                Auto-fill
                            </button>
                        </div>
                        <div style={{ color: "var(--color-text-muted)", fontFamily: "monospace" }}>
                            Username: <strong>admin</strong> | Password: <strong>admin123</strong>
                        </div>
                    </div>

                    <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                        <Link
                            to="/"
                            style={{
                                fontSize: "0.85rem",
                                color: "var(--color-text-muted)",
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem"
                            }}
                        >
                            <span>← Return to Storefront</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // =========================================================================
    // AUTHENTICATED: SHOW FULL ADMIN PANEL DASHBOARD & CRUD
    // =========================================================================
    const renderTabContent = () => {
        switch (activeTab) {
            case "products":
                return <AdminProducts />;
            case "categories":
                return <AdminCategories />;
            case "orders":
                return <AdminOrders />;
            case "coupons":
                return <AdminCoupons />;
            case "messages":
                return <AdminMessages />;
            case "settings":
                return <AdminSettings />;
            case "dashboard":
            default:
                return <AdminDashboard setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="admin-layout">
            {/* SIDEBAR */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <Link to="/" className="admin-brand">
                        <div className="admin-brand-icon">
                            <Leaf size={20} />
                        </div>
                        <div>
                            <span className="admin-brand-title">Leaf &amp; Clay</span>
                            <span className="admin-brand-sub">Admin Suite</span>
                        </div>
                    </Link>
                </div>

                <nav className="admin-sidebar-nav">
                    <button
                        className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                        onClick={() => setActiveTab("dashboard")}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === "products" ? "active" : ""}`}
                        onClick={() => setActiveTab("products")}
                    >
                        <Package size={18} />
                        <span>Products &amp; Plants</span>
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === "categories" ? "active" : ""}`}
                        onClick={() => setActiveTab("categories")}
                    >
                        <FolderTree size={18} />
                        <span>Categories</span>
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        <ShoppingBag size={18} />
                        <span>Orders</span>
                        {pendingOrdersCount > 0 && (
                            <span className="admin-nav-badge">{pendingOrdersCount}</span>
                        )}
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === "coupons" ? "active" : ""}`}
                        onClick={() => setActiveTab("coupons")}
                    >
                        <Tag size={18} />
                        <span>Coupons &amp; Deals</span>
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === "messages" ? "active" : ""}`}
                        onClick={() => setActiveTab("messages")}
                    >
                        <MessageSquare size={18} />
                        <span>Customer Inquiries</span>
                        {unreadMessagesCount > 0 && (
                            <span className="admin-nav-badge">{unreadMessagesCount}</span>
                        )}
                    </button>

                    <button
                        className={`admin-nav-item ${activeTab === "settings" ? "active" : ""}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        <Settings size={18} />
                        <span>Site Settings</span>
                    </button>
                </nav>

                <div className="admin-sidebar-footer">
                    <div style={{ padding: "0.5rem 0.25rem", borderBottom: "1px solid var(--color-border-subtle)", marginBottom: "0.5rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Signed in as:</div>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--color-text-main)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <UserCheck size={14} color="#2e7d32" />
                            <span>{currentUser?.name || "Administrator"}</span>
                        </div>
                    </div>

                    <Link to="/" className="admin-store-link">
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Leaf size={16} />
                            <span>View Live Store</span>
                        </span>
                        <ExternalLink size={14} />
                    </Link>

                    <button
                        onClick={adminLogout}
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        style={{ width: "100%", justifyContent: "center", gap: "0.5rem", marginTop: "0.35rem" }}
                    >
                        <LogOut size={14} />
                        <span>Sign Out &amp; Lock Admin</span>
                    </button>
                </div>
            </aside>

            {/* MAIN WORKSPACE */}
            <div className="admin-main">
                {/* Topbar */}
                <header className="admin-topbar">
                    <div className="admin-breadcrumb">
                        <span>Admin</span>
                        <span>/</span>
                        <strong>{activeTab}</strong>
                    </div>

                    <div className="admin-topbar-actions">
                        <button
                            className="admin-icon-btn"
                            onClick={toggleTheme}
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <Link to="/" className="admin-btn admin-btn-secondary admin-btn-sm">
                            <ExternalLink size={14} />
                            <span>Storefront</span>
                        </Link>

                        <button
                            onClick={adminLogout}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title="Lock Admin Panel"
                        >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </header>

                {/* Content Container */}
                <main className="admin-container">
                    {renderTabContent()}
                </main>
            </div>
        </div>
    );
}

export default Admin;
