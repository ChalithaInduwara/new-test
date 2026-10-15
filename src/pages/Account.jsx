import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import {
    User,
    ShoppingBag,
    MapPin,
    Phone,
    Mail,
    LogOut,
    ShieldCheck,
    Truck,
    Clock,
    CheckCircle2,
    Edit3,
    Save,
    X,
    Leaf,
    ArrowRight
} from "lucide-react";

export function Account() {
    const { currentUser, logout, updateProfile, isAdmin } = useAuth();
    const { orders } = useStore();
    const navigate = useNavigate();

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: currentUser?.name || "",
        phone: currentUser?.phone || "",
        address: currentUser?.address || "",
        city: currentUser?.city || "Colombo",
        postalCode: currentUser?.postalCode || ""
    });

    if (!currentUser) {
        return (
            <div className="container" style={{ padding: "5rem 1.5rem", textAlign: "center", maxWidth: "500px" }}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                    Account Sign In Required
                </h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                    Please sign in or create an account to view your plant order history and shipping details.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <Link to="/login" className="btn btn-primary">
                        Sign In / Register
                    </Link>
                    <Link to="/shop" className="btn btn-outline">
                        Explore Shop
                    </Link>
                </div>
            </div>
        );
    }

    // Filter orders matching customer email or phone
    const customerOrders = orders.filter((o) => {
        const orderEmail = o.customer?.email?.toLowerCase();
        const userEmail = currentUser?.email?.toLowerCase();
        const orderPhone = o.customer?.phone;
        const userPhone = currentUser?.phone;

        return (
            (orderEmail && userEmail && orderEmail === userEmail) ||
            (orderPhone && userPhone && orderPhone === userPhone) ||
            o.userId === currentUser.id
        );
    });

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateProfile(profileForm);
        setIsEditingProfile(false);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const getStatusChip = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return <span className="badge-chip status-delivered">Delivered</span>;
            case "shipped":
                return <span className="badge-chip status-shipped">Shipped</span>;
            case "processing":
                return <span className="badge-chip status-processing">Processing</span>;
            case "cancelled":
                return <span className="badge-chip status-cancelled">Cancelled</span>;
            default:
                return <span className="badge-chip status-pending">Pending Confirmation</span>;
        }
    };

    return (
        <div style={{ backgroundColor: "var(--color-sand-light, #fcf9f5)", minHeight: "85vh", padding: "3rem 1.5rem" }}>
            <div className="container" style={{ maxWidth: "1100px" }}>
                {/* Admin Alert Pill if Admin is logged in */}
                {isAdmin && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1rem 1.5rem",
                            borderRadius: "var(--radius-lg)",
                            backgroundColor: "var(--color-forest)",
                            color: "#ffffff",
                            marginBottom: "2rem",
                            boxShadow: "var(--shadow-sm)"
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <ShieldCheck size={24} color="#a6d8b8" />
                            <div>
                                <div style={{ fontWeight: 700 }}>Administrator Account Detected</div>
                                <div style={{ fontSize: "0.82rem", opacity: 0.85 }}>
                                    You have full management access to the store backend catalog and orders.
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/admin"
                            className="btn btn-primary"
                            style={{
                                backgroundColor: "#ffffff",
                                color: "var(--color-forest)",
                                textDecoration: "none",
                                padding: "0.5rem 1rem",
                                fontSize: "0.85rem",
                                fontWeight: 700
                            }}
                        >
                            Open Admin Suite →
                        </Link>
                    </div>
                )}

                {/* Profile & Orders Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", alignItems: "start" }}>
                    {/* Left Column: Profile Card */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title">
                                <User size={18} />
                                <span>Customer Profile</span>
                            </div>
                            <button
                                onClick={() => setIsEditingProfile(!isEditingProfile)}
                                className="admin-btn admin-btn-secondary admin-btn-sm"
                            >
                                <Edit3 size={14} />
                                <span>{isEditingProfile ? "Cancel" : "Edit"}</span>
                            </button>
                        </div>

                        <div className="admin-card-body">
                            {!isEditingProfile ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                                        <div
                                            style={{
                                                width: "48px",
                                                height: "48px",
                                                borderRadius: "var(--radius-full)",
                                                backgroundColor: "var(--color-emerald-light)",
                                                color: "var(--color-forest)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 800,
                                                fontSize: "1.2rem"
                                            }}
                                        >
                                            {currentUser.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{currentUser.name}</h3>
                                            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                                                @{currentUser.username} • <span style={{ textTransform: "capitalize" }}>{currentUser.role}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: "1px solid var(--color-border-subtle)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                            <Mail size={16} color="var(--color-text-muted)" />
                                            <span>{currentUser.email}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                            <Phone size={16} color="var(--color-text-muted)" />
                                            <span>{currentUser.phone || "No phone added"}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                                            <MapPin size={16} color="var(--color-text-muted)" style={{ marginTop: "3px" }} />
                                            <span>{currentUser.address ? `${currentUser.address}, ${currentUser.city || "Colombo"}` : "No address specified"}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="admin-btn admin-btn-danger admin-btn-sm"
                                        style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }}
                                    >
                                        <LogOut size={14} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                /* Edit Profile Form */
                                <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="admin-input"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Street Address</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={profileForm.address}
                                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">City</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={profileForm.city}
                                            onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                        />
                                    </div>

                                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingProfile(false)}
                                            className="admin-btn admin-btn-secondary admin-btn-sm"
                                            style={{ flex: 1 }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="admin-btn admin-btn-primary admin-btn-sm"
                                            style={{ flex: 1 }}
                                        >
                                            <Save size={14} />
                                            <span>Save</span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order History */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title">
                                <ShoppingBag size={18} />
                                <span>My Order History ({customerOrders.length})</span>
                            </div>
                            <Link to="/shop" className="admin-btn admin-btn-secondary admin-btn-sm">
                                <span>Order More Plants</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="admin-card-body" style={{ padding: customerOrders.length === 0 ? "3rem 1.5rem" : "1.25rem" }}>
                            {customerOrders.length === 0 ? (
                                <div style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                                    <Leaf size={36} color="var(--color-mint)" style={{ margin: "0 auto 0.75rem" }} />
                                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                                        No Orders Placed Yet
                                    </h4>
                                    <p style={{ fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                                        Browse our nursery catalog to order sculptural bonsai, cacti, and artisan pots.
                                    </p>
                                    <Link to="/shop" className="btn btn-primary">
                                        Browse Botanical Catalog
                                    </Link>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    {customerOrders.map((order) => {
                                        const formattedDate = new Date(order.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        });

                                        return (
                                            <div
                                                key={order.id}
                                                style={{
                                                    border: "1px solid var(--color-border)",
                                                    borderRadius: "var(--radius-md)",
                                                    padding: "1.25rem",
                                                    backgroundColor: "var(--color-surface)"
                                                }}
                                            >
                                                {/* Order Top Line */}
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                                    <div>
                                                        <div style={{ fontWeight: 800, color: "var(--color-forest)", fontSize: "1rem" }}>
                                                            Order {order.id}
                                                        </div>
                                                        <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                                                            Placed on {formattedDate}
                                                        </div>
                                                    </div>

                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                        {getStatusChip(order.status)}
                                                    </div>
                                                </div>

                                                {/* Item List */}
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", paddingBottom: "1rem", borderBottom: "1px solid var(--color-border-subtle)" }}>
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.88rem" }}>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                                                                {item.image ? (
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
                                                                    />
                                                                ) : (
                                                                    <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "var(--color-emerald-ultra-light, #f0f7f4)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-forest, #2d5a43)" }}>
                                                                        <Leaf size={18} />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                                                                    <span style={{ color: "var(--color-text-muted)", marginLeft: "0.4rem" }}>
                                                                        x{item.quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <span style={{ fontWeight: 700 }}>
                                                                Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Bottom Order Info */}
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.85rem", fontSize: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                                    <div style={{ color: "var(--color-text-muted)" }}>
                                                        {order.trackingNumber ? (
                                                            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                                                <Truck size={14} color="#2e7d32" />
                                                                <span>Tracking: <strong>{order.trackingNumber}</strong></span>
                                                            </span>
                                                        ) : (
                                                            <span>Standard Botanical Transit</span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: "1rem", fontWeight: 800 }}>
                                                        Total: Rs. {Number(order.total || 0).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
