import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useProducts } from "../../context/ProductContext";
import {
    Save,
    RotateCcw,
    Download,
    Upload,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Truck,
    Phone,
    Mail,
    MapPin,
    Home
} from "lucide-react";

export function AdminSettings() {
    const {
        siteSettings,
        updateSiteSettings,
        resetAllToFactoryDefaults,
        orders,
        coupons,
        messages
    } = useStore();
    const { products, categories, resetProductsAndCategories } = useProducts();

    const [form, setForm] = useState(siteSettings);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [confirmResetModal, setConfirmResetModal] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        updateSiteSettings(form);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    };

    const handleResetAll = () => {
        resetAllToFactoryDefaults(resetProductsAndCategories);
        setForm(siteSettings);
        setConfirmResetModal(false);
    };

    const handleExportData = () => {
        const fullBackup = {
            version: "1.0",
            exportDate: new Date().toISOString(),
            products,
            categories,
            orders,
            coupons,
            messages,
            siteSettings: form
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `leaf_clay_backup_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    const handleImportData = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.siteSettings) {
                    updateSiteSettings(parsed.siteSettings);
                    setForm(parsed.siteSettings);
                }
                if (parsed.products) {
                    localStorage.setItem("leaf_clay_products_v3", JSON.stringify(parsed.products));
                }
                if (parsed.orders) {
                    localStorage.setItem("leaf_clay_orders_v3", JSON.stringify(parsed.orders));
                }
                if (parsed.coupons) {
                    localStorage.setItem("leaf_clay_coupons_v3", JSON.stringify(parsed.coupons));
                }
                alert("Store data successfully imported! The page will refresh to apply all updates.");
                window.location.reload();
            } catch (err) {
                alert("Failed to parse JSON file. Please ensure it's a valid backup.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="admin-settings-view">
            <div className="admin-toolbar">
                <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Store Customizer &amp; Site Settings</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                        Customize announcement ribbons, shipping fees, hero headlines, and manage backups.
                    </p>
                </div>
                {savedSuccess && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#16a34a", fontWeight: 600, fontSize: "0.9rem" }}>
                        <CheckCircle2 size={18} />
                        <span>Settings saved to live site!</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSave}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                    {/* Announcement Bar & Sale Ribbon */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title">
                                <Sparkles size={18} color="var(--color-terracotta)" />
                                <span>Announcement Banner (Header Ribbon)</span>
                            </div>
                        </div>

                        <div className="admin-card-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-col-full admin-form-group">
                                    <label className="admin-label">Announcement Text</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={form.announcementText}
                                        onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                                        placeholder="Spring Garden Sale: Use code LEAF15 for 15% off..."
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Featured Promo Code</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={form.announcementCoupon}
                                        onChange={(e) => setForm({ ...form, announcementCoupon: e.target.value })}
                                        placeholder="LEAF15"
                                    />
                                </div>

                                <div className="admin-form-group" style={{ justifyContent: "center" }}>
                                    <label className="admin-label">Banner Visibility</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
                                        <input
                                            type="checkbox"
                                            id="announceActiveCheck"
                                            checked={form.announcementActive}
                                            onChange={(e) => setForm({ ...form, announcementActive: e.target.checked })}
                                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                                        />
                                        <label htmlFor="announceActiveCheck" style={{ fontSize: "0.9rem", cursor: "pointer" }}>
                                            Display announcement banner on store header
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Rules */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title">
                                <Truck size={18} color="var(--color-forest)" />
                                <span>Shipping Rates &amp; Free Delivery</span>
                            </div>
                        </div>

                        <div className="admin-card-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group">
                                    <label className="admin-label">Free Shipping Minimum Threshold (Rs.)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="admin-input"
                                        value={form.freeShippingThreshold}
                                        onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                                    />
                                    <span className="admin-help-text">
                                        Orders equal or above this spend amount automatically qualify for free shipping.
                                    </span>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Standard Transit Delivery Fee (Rs.)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="admin-input"
                                        value={form.standardShippingFee}
                                        onChange={(e) => setForm({ ...form, standardShippingFee: Number(e.target.value) })}
                                    />
                                    <span className="admin-help-text">
                                        Base fee applied when cart is below free shipping threshold.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Contact & Location */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title">
                                <MapPin size={18} color="var(--color-moss)" />
                                <span>Store Information &amp; Studio Hours</span>
                            </div>
                        </div>

                        <div className="admin-card-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group">
                                    <label className="admin-label">Store Customer Phone</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={form.storePhone}
                                        onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Store Email Address</label>
                                    <input
                                        type="email"
                                        className="admin-input"
                                        value={form.storeEmail}
                                        onChange={(e) => setForm({ ...form, storeEmail: e.target.value })}
                                    />
                                </div>

                                <div className="admin-form-col-full admin-form-group">
                                    <label className="admin-label">Physical Studio &amp; Nursery Address</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={form.storeAddress}
                                        onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Store Working Hours</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={form.storeHours}
                                        onChange={(e) => setForm({ ...form, storeHours: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Homepage Hero Texts */}
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <div className="admin-card-title">
                                <Home size={18} color="var(--color-forest)" />
                                <span>Homepage Hero Headlines</span>
                            </div>
                        </div>

                        <div className="admin-card-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group">
                                    <label className="admin-label">Hero Badge Pill</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={form.heroBadge}
                                        onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
                                    />
                                </div>

                                <div className="admin-form-col-full admin-form-group">
                                    <label className="admin-label">Hero Headline Title</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        value={form.heroTitle}
                                        onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                                    />
                                </div>

                                <div className="admin-form-col-full admin-form-group">
                                    <label className="admin-label">Hero Subtitle</label>
                                    <textarea
                                        className="admin-textarea"
                                        value={form.heroSubtitle}
                                        onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}>
                            <Save size={18} />
                            <span>Save All Site Settings</span>
                        </button>
                    </div>

                    {/* Backup & Factory Reset */}
                    <div className="admin-card" style={{ borderColor: "#fecaca" }}>
                        <div className="admin-card-header" style={{ backgroundColor: "var(--color-terracotta-light)" }}>
                            <div className="admin-card-title" style={{ color: "var(--color-terracotta)" }}>
                                <AlertTriangle size={18} />
                                <span>Data Backup, Export &amp; Factory Reset</span>
                            </div>
                        </div>

                        <div className="admin-card-body">
                            <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>
                                Export all current products, orders, coupons, and messages as a portable JSON backup file, or revert back to factory nursery defaults anytime.
                            </p>

                            <div className="admin-settings-actions">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={handleExportData}
                                >
                                    <Download size={16} />
                                    <span>Export Database (JSON)</span>
                                </button>

                                <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer" }}>
                                    <Upload size={16} />
                                    <span>Import Database (JSON)</span>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImportData}
                                        style={{ display: "none" }}
                                    />
                                </label>

                                <button
                                    type="button"
                                    className="admin-btn admin-btn-danger admin-reset-btn"
                                    onClick={() => setConfirmResetModal(true)}
                                >
                                    <RotateCcw size={16} />
                                    <span>Reset to Demo Defaults</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* CONFIRM RESET MODAL */}
            {confirmResetModal && (
                <div className="admin-modal-backdrop" onClick={() => setConfirmResetModal(false)}>
                    <div className="admin-modal" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title" style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <AlertTriangle size={20} />
                                <span>Restore Nursery Defaults</span>
                            </h2>
                        </div>
                        <div className="admin-modal-body">
                            <p style={{ marginBottom: "0.75rem" }}>
                                Are you sure you want to reset all store data?
                            </p>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                                This will restore the catalog of curated bonsai, cacti, pots, default demo orders, and standard promo codes.
                            </p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setConfirmResetModal(false)}>
                                Cancel
                            </button>
                            <button className="admin-btn admin-btn-danger" onClick={handleResetAll}>
                                <RotateCcw size={16} />
                                <span>Yes, Reset to Demo Data</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
