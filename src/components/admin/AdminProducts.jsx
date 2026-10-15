import React, { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Check,
    X,
    Filter,
    Package,
    Sparkles,
    AlertTriangle,
    Eye,
    CheckCircle2,
    LayoutGrid,
    List
} from "lucide-react";

const EMPTY_PRODUCT_FORM = {
    name: "",
    botanicalName: "",
    category: "Bonsai",
    price: "",
    originalPrice: "",
    stockCount: 10,
    inStock: true,
    badge: "",
    image: "",
    shortDescription: "",
    description: "",
    care: {
        light: "",
        water: "",
        humidity: "",
        difficulty: "Easy",
        petFriendly: true,
        potSize: "",
        height: ""
    }
};

export function AdminProducts() {
    const {
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustProductStock
    } = useProducts();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [viewMode, setViewMode] = useState("table"); // "table" or "grid"

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(EMPTY_PRODUCT_FORM);

    // Delete confirmation state
    const [productToDelete, setProductToDelete] = useState(null);

    // Filtered products list
    const filteredProducts = products.filter((p) => {
        const matchesCategory =
            selectedCategory === "all" ||
            p.category?.toLowerCase() === selectedCategory.toLowerCase();

        const matchesSearch =
            search.trim() === "" ||
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.botanicalName?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase());

        const matchesStock =
            stockFilter === "all" ||
            (stockFilter === "in_stock" && (p.stockCount > 0 && p.inStock)) ||
            (stockFilter === "low_stock" && p.stockCount > 0 && p.stockCount <= 5) ||
            (stockFilter === "out_of_stock" && (p.stockCount === 0 || !p.inStock));

        return matchesCategory && matchesSearch && matchesStock;
    });

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData(EMPTY_PRODUCT_FORM);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            ...product,
            price: product.price || "",
            originalPrice: product.originalPrice || "",
            care: {
                ...EMPTY_PRODUCT_FORM.care,
                ...(product.care || {})
            }
        });
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const productPayload = {
            ...formData,
            price: Number(formData.price),
            originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
            stockCount: Number(formData.stockCount),
            inStock: Number(formData.stockCount) > 0 ? formData.inStock : false
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productPayload);
        } else {
            addProduct(productPayload);
        }

        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
        }
    };

    return (
        <div className="admin-products-view">
            {/* Header Toolbar */}
            <div className="admin-toolbar">
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div className="admin-search-box">
                        <Search size={16} color="var(--color-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search plants, botanical names, categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="admin-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories ({products.length})</option>
                        {categories
                            .filter((c) => c.id !== "all")
                            .map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name} ({cat.count})
                                </option>
                            ))}
                    </select>

                    <select
                        className="admin-select"
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                    >
                        <option value="all">All Stock Status</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock (≤ 5)</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <div style={{ display: "flex", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                        <button
                            className={`admin-icon-btn ${viewMode === "table" ? "active" : ""}`}
                            style={{ borderRadius: 0, border: "none", width: 36, height: 36 }}
                            onClick={() => setViewMode("table")}
                            title="Table View"
                        >
                            <List size={16} />
                        </button>
                        <button
                            className={`admin-icon-btn ${viewMode === "grid" ? "active" : ""}`}
                            style={{ borderRadius: 0, border: "none", width: 36, height: 36 }}
                            onClick={() => setViewMode("grid")}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>

                    <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
                        <Plus size={16} />
                        <span>Add New Product</span>
                    </button>
                </div>
            </div>

            {/* Product Table View */}
            {viewMode === "table" ? (
                <div className="admin-card">
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Category</th>
                                    <th>Price (Rs.)</th>
                                    <th>Inventory</th>
                                    <th>Status</th>
                                    <th>Badge</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>
                                            No plants or products matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((p) => {
                                        const isLow = p.stockCount > 0 && p.stockCount <= 5;
                                        const isOut = p.stockCount === 0 || !p.inStock;

                                        return (
                                            <tr key={p.id}>
                                                <td>
                                                    <div className="product-cell">
                                                        <img
                                                            src={p.image}
                                                            alt={p.name}
                                                            className="product-thumb"
                                                        />
                                                        <div>
                                                            <div className="product-cell-name">{p.name}</div>
                                                            <div className="product-cell-sub">{p.botanicalName}</div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="badge-chip badge-neutral">{p.category}</span>
                                                </td>

                                                <td>
                                                    <div style={{ fontWeight: 700 }}>
                                                        Rs. {Number(p.price).toLocaleString()}
                                                    </div>
                                                    {p.originalPrice && (
                                                        <div style={{ fontSize: "0.75rem", textDecoration: "line-through", color: "var(--color-text-muted)" }}>
                                                            Rs. {Number(p.originalPrice).toLocaleString()}
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                        <button
                                                            className="admin-btn admin-btn-secondary admin-btn-sm"
                                                            style={{ padding: "0.2rem 0.45rem", minWidth: "24px" }}
                                                            onClick={() => adjustProductStock(p.id, -1)}
                                                            title="Decrease stock"
                                                        >
                                                            -
                                                        </button>
                                                        <span
                                                            style={{
                                                                fontWeight: 700,
                                                                minWidth: "24px",
                                                                textAlign: "center",
                                                                color: isOut ? "#dc2626" : isLow ? "#d97706" : "inherit"
                                                            }}
                                                        >
                                                            {p.stockCount}
                                                        </span>
                                                        <button
                                                            className="admin-btn admin-btn-secondary admin-btn-sm"
                                                            style={{ padding: "0.2rem 0.45rem", minWidth: "24px" }}
                                                            onClick={() => adjustProductStock(p.id, 5)}
                                                            title="Add 5 to stock"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>

                                                <td>
                                                    {isOut ? (
                                                        <span className="badge-chip status-out-of-stock">Out of Stock</span>
                                                    ) : isLow ? (
                                                        <span className="badge-chip status-low-stock">Low Stock</span>
                                                    ) : (
                                                        <span className="badge-chip status-in-stock">In Stock</span>
                                                    )}
                                                </td>

                                                <td>
                                                    {p.badge ? (
                                                        <span
                                                            style={{
                                                                fontSize: "0.75rem",
                                                                fontWeight: 600,
                                                                padding: "0.15rem 0.5rem",
                                                                borderRadius: "var(--radius-full)",
                                                                backgroundColor: "var(--color-terracotta-light)",
                                                                color: "var(--color-terracotta)"
                                                            }}
                                                        >
                                                            {p.badge}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>—</span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                                        <button
                                                            className="admin-icon-btn"
                                                            onClick={() => openEditModal(p)}
                                                            title="Edit Botanical Item"
                                                        >
                                                            <Edit3 size={15} />
                                                        </button>
                                                        <button
                                                            className="admin-icon-btn"
                                                            style={{ color: "#dc2626" }}
                                                            onClick={() => setProductToDelete(p)}
                                                            title="Delete Item"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Grid Cards View */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    {filteredProducts.map((p) => (
                        <div key={p.id} className="admin-card" style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                {p.badge && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            left: "10px",
                                            backgroundColor: "var(--color-terracotta)",
                                            color: "#fff",
                                            fontSize: "0.72rem",
                                            fontWeight: 700,
                                            padding: "0.2rem 0.6rem",
                                            borderRadius: "var(--radius-full)"
                                        }}
                                    >
                                        {p.badge}
                                    </span>
                                )}
                                <span
                                    className={`badge-chip ${p.stockCount === 0 ? "status-out-of-stock" : p.stockCount <= 5 ? "status-low-stock" : "status-in-stock"}`}
                                    style={{ position: "absolute", bottom: "10px", right: "10px" }}
                                >
                                    {p.stockCount === 0 ? "Out of Stock" : `${p.stockCount} in stock`}
                                </span>
                            </div>

                            <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                                    {p.category}
                                </div>
                                <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0.25rem 0" }}>{p.name}</h3>
                                <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontStyle: "italic", marginBottom: "0.75rem" }}>
                                    {p.botanicalName}
                                </p>

                                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border-subtle)" }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                                            Rs. {Number(p.price).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.4rem" }}>
                                        <button className="admin-icon-btn" onClick={() => openEditModal(p)}>
                                            <Edit3 size={15} />
                                        </button>
                                        <button className="admin-icon-btn" style={{ color: "#dc2626" }} onClick={() => setProductToDelete(p)}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ADD / EDIT PRODUCT MODAL */}
            {isModalOpen && (
                <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">
                                {editingProduct ? "Edit Botanical Specimen" : "Add New Botanical Product"}
                            </h2>
                            <button className="admin-icon-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                            <div className="admin-modal-body">
                                <div className="admin-form-grid">
                                    {/* Product Name */}
                                    <div className="admin-form-group">
                                        <label className="admin-label">Product Common Name *</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Japanese Juniper Bonsai"
                                        />
                                    </div>

                                    {/* Botanical Latin Name */}
                                    <div className="admin-form-group">
                                        <label className="admin-label">Botanical Latin Name</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={formData.botanicalName}
                                            onChange={(e) => setFormData({ ...formData, botanicalName: e.target.value })}
                                            placeholder="e.g. Juniperus procumbens 'Nana'"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="admin-form-group">
                                        <label className="admin-label">Category *</label>
                                        <select
                                            className="admin-select"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {categories
                                                .filter((c) => c.id !== "all")
                                                .map((c) => (
                                                    <option key={c.id} value={c.name}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* Badge */}
                                    <div className="admin-form-group">
                                        <label className="admin-label">Marketing Badge</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={formData.badge}
                                            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                            placeholder="e.g. Best Seller, Artisan Pick, Rare"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="admin-form-group">
                                        <label className="admin-label">Price (Rs.) *</label>
                                        <input
                                            type="number"
                                            className="admin-input"
                                            required
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="2500"
                                        />
                                    </div>

                                    {/* Original Strike Price */}
                                    <div className="admin-form-group">
                                        <label className="admin-label">Original Price (Rs.) (for sale discount)</label>
                                        <input
                                            type="number"
                                            className="admin-input"
                                            min="0"
                                            value={formData.originalPrice}
                                            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                            placeholder="3200 (optional)"
                                        />
                                    </div>

                                    {/* Stock Count */}
                                    <div className="admin-form-group">
                                        <label className="admin-label">Stock Quantity</label>
                                        <input
                                            type="number"
                                            className="admin-input"
                                            min="0"
                                            value={formData.stockCount}
                                            onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                                        />
                                    </div>

                                    {/* In Stock Active Switch */}
                                    <div className="admin-form-group" style={{ justifyContent: "center" }}>
                                        <label className="admin-label">Availability Status</label>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}>
                                            <input
                                                type="checkbox"
                                                id="inStockCheck"
                                                checked={formData.inStock}
                                                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                                style={{ width: "18px", height: "18px", cursor: "pointer" }}
                                            />
                                            <label htmlFor="inStockCheck" style={{ fontSize: "0.9rem", cursor: "pointer" }}>
                                                Listed as Available for Purchase
                                            </label>
                                        </div>
                                    </div>

                                    {/* Image Selector */}
                                    <div className="admin-form-col-full admin-form-group">
                                        <label className="admin-label">Image URL *</label>
                                        <input
                                            type="url"
                                            className="admin-input"
                                            required
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://..."
                                        />
                                        <span className="admin-help-text">
                                            Quick Presets: Select a botanical specimen photo below:
                                        </span>
                                        <div className="image-presets-row">
                                            {IMAGE_PRESETS.map((preset, idx) => (
                                                <img
                                                    key={idx}
                                                    src={preset.url}
                                                    alt={preset.name}
                                                    title={preset.name}
                                                    className={`image-preset-thumb ${formData.image === preset.url ? "selected" : ""}`}
                                                    onClick={() => setFormData({ ...formData, image: preset.url })}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Short Description */}
                                    <div className="admin-form-col-full admin-form-group">
                                        <label className="admin-label">Short Description</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={formData.shortDescription}
                                            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                            placeholder="A succinct one-sentence highlight of this specimen..."
                                        />
                                    </div>

                                    {/* Full Botanical Description */}
                                    <div className="admin-form-col-full admin-form-group">
                                        <label className="admin-label">Full Botanical Description</label>
                                        <textarea
                                            className="admin-textarea"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Detailed history, aesthetics, root structure, foliage details..."
                                        />
                                    </div>

                                    {/* Care Info Fields */}
                                    <div className="admin-form-col-full" style={{ marginTop: "0.5rem" }}>
                                        <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--color-forest)" }}>
                                            Botanical Care Specifications
                                        </h4>
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Light Requirement</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={formData.care.light}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    care: { ...formData.care, light: e.target.value }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Watering</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={formData.care.water}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    care: { ...formData.care, water: e.target.value }
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Care Difficulty</label>
                                        <select
                                            className="admin-select"
                                            value={formData.care.difficulty}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    care: { ...formData.care, difficulty: e.target.value }
                                                })
                                            }
                                        >
                                            <option value="Easy">Easy (Beginner-friendly)</option>
                                            <option value="Moderate">Moderate (Requires mindful watering)</option>
                                            <option value="Advanced">Advanced (Artisan pruning)</option>
                                        </select>
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Pot Size &amp; Type</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={formData.care.potSize}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    care: { ...formData.care, potSize: e.target.value }
                                                })
                                            }
                                        />
                                    </div>
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
                                    <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {productToDelete && (
                <div className="admin-modal-backdrop" onClick={() => setProductToDelete(null)}>
                    <div className="admin-modal" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title" style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <AlertTriangle size={20} />
                                <span>Delete Specimen</span>
                            </h2>
                            <button className="admin-icon-btn" onClick={() => setProductToDelete(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <p style={{ marginBottom: "1rem" }}>
                                Are you sure you want to delete <strong>"{productToDelete.name}"</strong>?
                            </p>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                                This will remove the item from the catalog, shop filters, and search results. You can always re-add it or reset to demo data later.
                            </p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setProductToDelete(null)}>
                                Cancel
                            </button>
                            <button className="admin-btn admin-btn-danger" onClick={confirmDelete}>
                                <Trash2 size={16} />
                                <span>Yes, Delete Product</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
