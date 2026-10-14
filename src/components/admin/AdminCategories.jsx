import React, { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import {
    Plus,
    Edit3,
    Trash2,
    FolderTree,
    X,
    Check,
    AlertTriangle,
    Leaf,
    Trees,
    Sun,
    Flower2,
    Archive,
    Sparkles
} from "lucide-react";

export function AdminCategories() {
    const { categories, addCategory, updateCategory, deleteCategory, products } = useProducts();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("Leaf");

    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const openAddModal = () => {
        setEditingCategory(null);
        setName("");
        setDescription("");
        setIcon("Leaf");
        setIsModalOpen(true);
    };

    const openEditModal = (cat) => {
        setEditingCategory(cat);
        setName(cat.name);
        setDescription(cat.description || "");
        setIcon(cat.icon || "Leaf");
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            updateCategory(editingCategory.id, {
                name,
                description,
                icon
            });
        } else {
            addCategory({
                name,
                description,
                icon
            });
        }
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            deleteCategory(categoryToDelete.id);
            setCategoryToDelete(null);
        }
    };

    const renderIcon = (iconName) => {
        switch (iconName) {
            case "Trees":
                return <Trees size={20} />;
            case "Sun":
                return <Sun size={20} />;
            case "Flower2":
                return <Flower2 size={20} />;
            case "Archive":
                return <Archive size={20} />;
            default:
                return <Leaf size={20} />;
        }
    };

    return (
        <div className="admin-categories-view">
            <div className="admin-toolbar">
                <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Botanical Collections &amp; Categories</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                        Organize your plants, bonsai, cacti, and ceramic pots for customer navigation.
                    </p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
                    <Plus size={16} />
                    <span>Add New Category</span>
                </button>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Description</th>
                                <th>Products Linked</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => {
                                const isAll = cat.id === "all";
                                return (
                                    <tr key={cat.id}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div
                                                    style={{
                                                        width: "36px",
                                                        height: "36px",
                                                        borderRadius: "var(--radius-sm)",
                                                        backgroundColor: "var(--color-emerald-light)",
                                                        color: "var(--color-forest)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    {renderIcon(cat.icon)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: "var(--color-text-main)" }}>
                                                        {cat.name}
                                                    </div>
                                                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                                                        ID: <code>{cat.id}</code>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                                                {cat.description || "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="badge-chip badge-neutral">
                                                {cat.count} product{cat.count !== 1 ? "s" : ""}
                                            </span>
                                        </td>

                                        <td>
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                                {!isAll && (
                                                    <>
                                                        <button
                                                            className="admin-icon-btn"
                                                            onClick={() => openEditModal(cat)}
                                                            title="Edit Category"
                                                        >
                                                            <Edit3 size={15} />
                                                        </button>
                                                        <button
                                                            className="admin-icon-btn"
                                                            style={{ color: "#dc2626" }}
                                                            onClick={() => setCategoryToDelete(cat)}
                                                            title="Delete Category"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD / EDIT CATEGORY MODAL */}
            {isModalOpen && (
                <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    <div className="admin-modal" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h2>
                            <button className="admin-icon-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit}>
                            <div className="admin-modal-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div className="admin-form-group">
                                    <label className="admin-label">Category Name *</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Hanging Foliage, Ceramic Saucers"
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Description</label>
                                    <textarea
                                        className="admin-textarea"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe the aesthetic and purpose of this collection..."
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Icon Style</label>
                                    <select
                                        className="admin-select"
                                        value={icon}
                                        onChange={(e) => setIcon(e.target.value)}
                                    >
                                        <option value="Leaf">Leaf (General botanical)</option>
                                        <option value="Trees">Trees (Bonsai / Canopy)</option>
                                        <option value="Sun">Sun (Cacti / Desert)</option>
                                        <option value="Flower2">Flower (Succulents &amp; Blooms)</option>
                                        <option value="Archive">Archive (Pots &amp; Ceramics)</option>
                                    </select>
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
                                    <span>{editingCategory ? "Update Category" : "Save Category"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CATEGORY CONFIRMATION */}
            {categoryToDelete && (
                <div className="admin-modal-backdrop" onClick={() => setCategoryToDelete(null)}>
                    <div className="admin-modal" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title" style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <AlertTriangle size={20} />
                                <span>Delete Category</span>
                            </h2>
                            <button className="admin-icon-btn" onClick={() => setCategoryToDelete(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <p style={{ marginBottom: "1rem" }}>
                                Are you sure you want to remove the category <strong>"{categoryToDelete.name}"</strong>?
                            </p>
                            {categoryToDelete.count > 0 && (
                                <p style={{ fontSize: "0.85rem", color: "#d97706", fontWeight: 600 }}>
                                    Warning: There are currently {categoryToDelete.count} product(s) assigned to this category.
                                </p>
                            )}
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setCategoryToDelete(null)}>
                                Cancel
                            </button>
                            <button className="admin-btn admin-btn-danger" onClick={confirmDelete}>
                                <Trash2 size={16} />
                                <span>Delete Category</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
