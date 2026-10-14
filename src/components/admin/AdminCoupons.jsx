import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import {
    Plus,
    Tag,
    Edit3,
    Trash2,
    X,
    Check,
    AlertTriangle,
    Percent,
    Sparkles
} from "lucide-react";

export function AdminCoupons() {
    const {
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus
    } = useStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formError, setFormError] = useState("");

    const [formState, setFormState] = useState({
        code: "",
        discountPercent: 15,
        type: "percentage",
        minSpend: 0,
        description: "",
        isActive: true
    });

    const [couponToDelete, setCouponToDelete] = useState(null);

    const openAddModal = () => {
        setEditingCoupon(null);
        setFormError("");
        setFormState({
            code: "",
            discountPercent: 15,
            type: "percentage",
            minSpend: 0,
            description: "",
            isActive: true
        });
        setIsModalOpen(true);
    };

    const openEditModal = (c) => {
        setEditingCoupon(c);
        setFormError("");
        setFormState({
            code: c.code,
            discountPercent: c.discountPercent,
            type: c.type || "percentage",
            minSpend: c.minSpend || 0,
            description: c.description || "",
            isActive: c.isActive !== false
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormError("");

        if (!formState.code.trim()) {
            setFormError("Coupon code is required");
            return;
        }

        if (editingCoupon) {
            updateCoupon(editingCoupon.code, formState);
            setIsModalOpen(false);
        } else {
            const res = addCoupon(formState);
            if (!res.success) {
                setFormError(res.message);
            } else {
                setIsModalOpen(false);
            }
        }
    };

    return (
        <div className="admin-coupons-view">
            <div className="admin-toolbar">
                <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Promo Codes &amp; Seasonal Discounts</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                        Any coupon created here instantly works on the live checkout and cart page.
                    </p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
                    <Plus size={16} />
                    <span>Create Promo Code</span>
                </button>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Coupon Code</th>
                                <th>Discount Value</th>
                                <th>Min. Order Spend</th>
                                <th>Times Used</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon.code}>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <Tag size={16} color="var(--color-forest)" />
                                            <code style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--color-forest)" }}>
                                                {coupon.code}
                                            </code>
                                        </div>
                                    </td>

                                    <td>
                                        <span style={{ fontWeight: 700 }}>
                                            {coupon.type === "fixed"
                                                ? `Rs. ${Number(coupon.discountPercent).toLocaleString()} Flat Off`
                                                : `${coupon.discountPercent}% Off`}
                                        </span>
                                    </td>

                                    <td>
                                        {coupon.minSpend > 0 ? (
                                            <span>Rs. {Number(coupon.minSpend).toLocaleString()}</span>
                                        ) : (
                                            <span style={{ color: "var(--color-text-muted)" }}>No minimum</span>
                                        )}
                                    </td>

                                    <td>
                                        <span className="badge-chip badge-neutral">
                                            {coupon.usageCount || 0} times
                                        </span>
                                    </td>

                                    <td>
                                        <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                                            {coupon.description || "—"}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            onClick={() => toggleCouponStatus(coupon.code)}
                                            className={`badge-chip ${coupon.isActive ? "status-in-stock" : "status-out-of-stock"}`}
                                            style={{ border: "none", cursor: "pointer" }}
                                            title="Click to toggle status"
                                        >
                                            {coupon.isActive ? "Active (Enabled)" : "Disabled"}
                                        </button>
                                    </td>

                                    <td>
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem" }}>
                                            <button
                                                className="admin-icon-btn"
                                                onClick={() => openEditModal(coupon)}
                                                title="Edit Coupon"
                                            >
                                                <Edit3 size={15} />
                                            </button>
                                            <button
                                                className="admin-icon-btn"
                                                style={{ color: "#dc2626" }}
                                                onClick={() => setCouponToDelete(coupon)}
                                                title="Delete Coupon"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD / EDIT COUPON MODAL */}
            {isModalOpen && (
                <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    <div className="admin-modal" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">
                                {editingCoupon ? `Edit Coupon "${editingCoupon.code}"` : "Create New Promo Code"}
                            </h2>
                            <button className="admin-icon-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit}>
                            <div className="admin-modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {formError && (
                                    <div style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", backgroundColor: "#fee2e2", color: "#b91c1c", fontSize: "0.85rem" }}>
                                        {formError}
                                    </div>
                                )}

                                <div className="admin-form-group">
                                    <label className="admin-label">Promo Code *</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        required
                                        style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}
                                        value={formState.code}
                                        onChange={(e) =>
                                            setFormState({ ...formState, code: e.target.value.toUpperCase() })
                                        }
                                        placeholder="e.g. MONSOON20"
                                    />
                                </div>

                                <div className="admin-form-grid">
                                    <div className="admin-form-group">
                                        <label className="admin-label">Discount Type</label>
                                        <select
                                            className="admin-select"
                                            value={formState.type}
                                            onChange={(e) =>
                                                setFormState({ ...formState, type: e.target.value })
                                            }
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (Rs.)</option>
                                        </select>
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">
                                            {formState.type === "percentage" ? "Discount Rate (%) *" : "Discount Amount (Rs.) *"}
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="admin-input"
                                            required
                                            value={formState.discountPercent}
                                            onChange={(e) =>
                                                setFormState({ ...formState, discountPercent: Number(e.target.value) })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Minimum Order Requirement (Rs.)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="admin-input"
                                        value={formState.minSpend}
                                        onChange={(e) =>
                                            setFormState({ ...formState, minSpend: Number(e.target.value) })
                                        }
                                        placeholder="0 for no minimum"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Description / Offer Note</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={formState.description}
                                        onChange={(e) =>
                                            setFormState({ ...formState, description: e.target.value })
                                        }
                                        placeholder="e.g. 20% off all indoor bonsai collections"
                                    />
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                                    <input
                                        type="checkbox"
                                        id="couponActiveCheck"
                                        checked={formState.isActive}
                                        onChange={(e) =>
                                            setFormState({ ...formState, isActive: e.target.checked })
                                        }
                                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                                    />
                                    <label htmlFor="couponActiveCheck" style={{ fontSize: "0.9rem", cursor: "pointer" }}>
                                        Active coupon code (enabled for customers)
                                    </label>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    <Check size={16} />
                                    <span>{editingCoupon ? "Save Changes" : "Create Code"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE COUPON CONFIRMATION */}
            {couponToDelete && (
                <div className="admin-modal-backdrop" onClick={() => setCouponToDelete(null)}>
                    <div className="admin-modal" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title" style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <AlertTriangle size={20} />
                                <span>Delete Coupon</span>
                            </h2>
                            <button className="admin-icon-btn" onClick={() => setCouponToDelete(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <p>
                                Are you sure you want to delete promo code <strong>{couponToDelete.code}</strong>?
                            </p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setCouponToDelete(null)}>
                                Cancel
                            </button>
                            <button
                                className="admin-btn admin-btn-danger"
                                onClick={() => {
                                    deleteCoupon(couponToDelete.code);
                                    setCouponToDelete(null);
                                }}
                            >
                                <Trash2 size={16} />
                                <span>Delete Coupon</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
