import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useProducts } from "../../context/ProductContext";
import {
    ShoppingBag,
    Search,
    Eye,
    Trash2,
    Plus,
    X,
    Check,
    Truck,
    CreditCard,
    Banknote,
    FileText,
    AlertTriangle,
    Save,
    Clock,
    Leaf
} from "lucide-react";

export function AdminOrders() {
    const { orders, createOrder, updateOrder, updateOrderStatus, deleteOrder } = useStore();
    const { products } = useProducts();

    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");

    // Details modal
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Create Manual Order modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    // Manual order form state
    const [newOrderForm, setNewOrderForm] = useState({
        customer: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "Colombo",
            postalCode: "",
            notes: ""
        },
        selectedProductId: products[0]?.id || "",
        quantity: 1,
        shippingFee: 350,
        paymentMethod: "cod",
        status: "Pending"
    });

    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            statusFilter === "all" || order.status?.toLowerCase() === statusFilter.toLowerCase();

        const searchLower = search.toLowerCase();
        const matchesSearch =
            search.trim() === "" ||
            order.id?.toLowerCase().includes(searchLower) ||
            order.customer?.firstName?.toLowerCase().includes(searchLower) ||
            order.customer?.lastName?.toLowerCase().includes(searchLower) ||
            order.customer?.phone?.includes(search) ||
            order.customer?.email?.toLowerCase().includes(searchLower);

        return matchesStatus && matchesSearch;
    });

    const counts = {
        all: orders.length,
        pending: orders.filter((o) => o.status === "Pending").length,
        processing: orders.filter((o) => o.status === "Processing").length,
        shipped: orders.filter((o) => o.status === "Shipped").length,
        delivered: orders.filter((o) => o.status === "Delivered").length,
        cancelled: orders.filter((o) => o.status === "Cancelled").length
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
                return <span className="badge-chip status-pending">Pending</span>;
        }
    };

    const handleCreateManualOrder = (e) => {
        e.preventDefault();
        const chosenProduct = products.find((p) => p.id === newOrderForm.selectedProductId) || products[0];
        const subtotal = (Number(chosenProduct?.price) || 0) * Number(newOrderForm.quantity);
        const total = subtotal + Number(newOrderForm.shippingFee);

        createOrder({
            customer: newOrderForm.customer,
            items: [
                {
                    id: chosenProduct.id,
                    name: chosenProduct.name,
                    category: chosenProduct.category,
                    price: chosenProduct.price,
                    quantity: Number(newOrderForm.quantity),
                    image: chosenProduct.image
                }
            ],
            subtotal,
            discountAmount: 0,
            couponCode: "",
            shippingFee: Number(newOrderForm.shippingFee),
            total,
            paymentMethod: newOrderForm.paymentMethod,
            status: newOrderForm.status,
            adminNotes: "Manual phone or studio in-person order created in admin panel."
        });

        setIsCreateModalOpen(false);
    };

    const handleUpdateOrderDetails = (e) => {
        e.preventDefault();
        if (selectedOrder) {
            updateOrder(selectedOrder.id, selectedOrder);
            setSelectedOrder(null);
        }
    };

    return (
        <div className="admin-orders-view">
            {/* Header Toolbar */}
            <div className="admin-toolbar">
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div className="admin-search-box">
                        <Search size={16} color="var(--color-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by Order #, Customer Name, Phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((st) => (
                            <button
                                key={st}
                                className={`admin-btn admin-btn-sm ${statusFilter === st ? "admin-btn-primary" : "admin-btn-secondary"}`}
                                onClick={() => setStatusFilter(st)}
                                style={{ textTransform: "capitalize" }}
                            >
                                <span>{st}</span>
                                <span style={{ opacity: 0.8, fontSize: "0.72rem" }}>({counts[st] || 0})</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button className="admin-btn admin-btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={16} />
                    <span>Create Manual Order</span>
                </button>
            </div>

            {/* Orders Table */}
            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Items Ordered</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>
                                        No customer orders found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const dateObj = new Date(order.date);
                                    const formattedDate = dateObj.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    });

                                    return (
                                        <tr key={order.id}>
                                            <td>
                                                <strong style={{ color: "var(--color-forest)", cursor: "pointer" }} onClick={() => setSelectedOrder(order)}>
                                                    {order.id}
                                                </strong>
                                            </td>

                                            <td style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                                                {formattedDate}
                                            </td>

                                            <td>
                                                <div style={{ fontWeight: 600 }}>
                                                    {order.customer?.firstName} {order.customer?.lastName}
                                                </div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                                                    {order.customer?.city || "Colombo"} • {order.customer?.phone}
                                                </div>
                                            </td>

                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                    {order.items?.slice(0, 3).map((item, idx) => (
                                                        item.image ? (
                                                            <img
                                                                key={idx}
                                                                src={item.image}
                                                                alt={item.name}
                                                                title={`${item.name} (x${item.quantity})`}
                                                                style={{
                                                                    width: "28px",
                                                                    height: "28px",
                                                                    borderRadius: "4px",
                                                                    objectFit: "cover",
                                                                    border: "1px solid var(--color-border)"
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                key={idx}
                                                                title={`${item.name} (x${item.quantity})`}
                                                                style={{
                                                                    width: "28px",
                                                                    height: "28px",
                                                                    borderRadius: "4px",
                                                                    backgroundColor: "var(--color-emerald-ultra-light, #f0f7f4)",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    color: "var(--color-forest, #2d5a43)",
                                                                    border: "1px solid var(--color-border)"
                                                                }}
                                                            >
                                                                <Leaf size={14} />
                                                            </div>
                                                        )
                                                    ))}
                                                    {order.items?.length > 3 && (
                                                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                                                            +{order.items.length - 3}
                                                        </span>
                                                    )}
                                                    <span style={{ fontSize: "0.8rem", marginLeft: "0.3rem" }}>
                                                        ({order.items?.reduce((s, i) => s + (i.quantity || 1), 0)} items)
                                                    </span>
                                                </div>
                                            </td>

                                            <td style={{ fontWeight: 700 }}>
                                                Rs. {Number(order.total || 0).toLocaleString()}
                                            </td>

                                            <td>
                                                <span className="badge-chip badge-neutral" style={{ textTransform: "uppercase", fontSize: "0.7rem" }}>
                                                    {order.paymentMethod || "card"}
                                                </span>
                                            </td>

                                            <td>
                                                <select
                                                    className="admin-select"
                                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.78rem" }}
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>

                                            <td>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem" }}>
                                                    <button
                                                        className="admin-icon-btn"
                                                        onClick={() => setSelectedOrder(order)}
                                                        title="View Invoice & Details"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        className="admin-icon-btn"
                                                        style={{ color: "#dc2626" }}
                                                        onClick={() => setOrderToDelete(order)}
                                                        title="Delete Order"
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

            {/* ORDER DETAILS & INVOICE MODAL */}
            {selectedOrder && (
                <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div className="admin-modal" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <div>
                                <h2 className="admin-modal-title">Order {selectedOrder.id}</h2>
                                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                                    Placed on {new Date(selectedOrder.date).toLocaleString()}
                                </span>
                            </div>
                            <button className="admin-icon-btn" onClick={() => setSelectedOrder(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateOrderDetails}>
                            <div className="admin-modal-body">
                                {/* Customer & Shipping Info */}
                                <div className="admin-order-modal-grid" style={{ marginBottom: "1.5rem", padding: "1rem", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-emerald-ultra-light)" }}>
                                    <div>
                                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-forest)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                                            Delivery Address
                                        </div>
                                        <div style={{ fontWeight: 600 }}>
                                            {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                                        </div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                                            {selectedOrder.customer?.address}
                                        </div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                                            {selectedOrder.customer?.city} {selectedOrder.customer?.postalCode}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-forest)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                                            Contact &amp; Delivery Method
                                        </div>
                                        <div style={{ fontSize: "0.85rem" }}>
                                            Phone: <strong>{selectedOrder.customer?.phone}</strong>
                                        </div>
                                        <div style={{ fontSize: "0.85rem" }}>
                                            Email: {selectedOrder.customer?.email}
                                        </div>
                                        <div style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
                                            Shipping: <span className="badge-chip badge-neutral">{selectedOrder.shippingMethod || "standard"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Table */}
                                <div style={{ marginBottom: "1.5rem" }}>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                                        Ordered Specimens &amp; Items
                                    </div>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Specimen</th>
                                                <th>Qty</th>
                                                <th>Unit Price</th>
                                                <th style={{ textAlign: "right" }}>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items?.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    style={{ width: "32px", height: "32px", borderRadius: "4px", objectFit: "cover" }}
                                                                />
                                                            ) : (
                                                                <div style={{ width: "32px", height: "32px", borderRadius: "4px", backgroundColor: "var(--color-emerald-ultra-light, #f0f7f4)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-forest, #2d5a43)" }}>
                                                                    <Leaf size={16} />
                                                                </div>
                                                            )}
                                                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>x{item.quantity}</td>
                                                    <td>Rs. {Number(item.price).toLocaleString()}</td>
                                                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                                                        Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Financial Summary */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "flex-end", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-border-subtle)" }}>
                                    <div style={{ fontSize: "0.85rem" }}>
                                        Subtotal: <strong>Rs. {Number(selectedOrder.subtotal || 0).toLocaleString()}</strong>
                                    </div>
                                    {selectedOrder.discountAmount > 0 && (
                                        <div style={{ fontSize: "0.85rem", color: "#16a34a" }}>
                                            Discount ({selectedOrder.couponCode || "Coupon"}): -Rs. {Number(selectedOrder.discountAmount).toLocaleString()}
                                        </div>
                                    )}
                                    <div style={{ fontSize: "0.85rem" }}>
                                        Shipping Fee: <strong>Rs. {Number(selectedOrder.shippingFee || 0).toLocaleString()}</strong>
                                    </div>
                                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-forest)", marginTop: "0.25rem" }}>
                                        Total Paid: Rs. {Number(selectedOrder.total || 0).toLocaleString()}
                                    </div>
                                </div>

                                {/* Tracking & Status Management */}
                                <div className="admin-form-grid" style={{ marginTop: "1.25rem" }}>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Fulfillment Status</label>
                                        <select
                                            className="admin-select"
                                            value={selectedOrder.status}
                                            onChange={(e) =>
                                                setSelectedOrder({ ...selectedOrder, status: e.target.value })
                                            }
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Courier Tracking Number</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={selectedOrder.trackingNumber || ""}
                                            onChange={(e) =>
                                                setSelectedOrder({ ...selectedOrder, trackingNumber: e.target.value })
                                            }
                                            placeholder="e.g. SLP-98421"
                                        />
                                    </div>

                                    <div className="admin-form-col-full admin-form-group">
                                        <label className="admin-label">Internal Nursery Notes</label>
                                        <textarea
                                            className="admin-textarea"
                                            style={{ minHeight: "60px" }}
                                            value={selectedOrder.adminNotes || ""}
                                            onChange={(e) =>
                                                setSelectedOrder({ ...selectedOrder, adminNotes: e.target.value })
                                            }
                                            placeholder="Notes about packaging, courier pickup, fragile labeling..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Close
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    <Save size={16} />
                                    <span>Save Fulfillment Details</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CREATE MANUAL ORDER MODAL */}
            {isCreateModalOpen && (
                <div className="admin-modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="admin-modal" style={{ maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">Record Manual / Walk-in Order</h2>
                            <button className="admin-icon-btn" onClick={() => setIsCreateModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateManualOrder}>
                            <div className="admin-modal-body">
                                <div className="admin-form-grid">
                                    <div className="admin-form-group">
                                        <label className="admin-label">Customer First Name *</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            required
                                            value={newOrderForm.customer.firstName}
                                            onChange={(e) =>
                                                setNewOrderForm({
                                                    ...newOrderForm,
                                                    customer: { ...newOrderForm.customer, firstName: e.target.value }
                                                })
                                            }
                                            placeholder="First name"
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Customer Last Name</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={newOrderForm.customer.lastName}
                                            onChange={(e) =>
                                                setNewOrderForm({
                                                    ...newOrderForm,
                                                    customer: { ...newOrderForm.customer, lastName: e.target.value }
                                                })
                                            }
                                            placeholder="Last name"
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Phone *</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            required
                                            value={newOrderForm.customer.phone}
                                            onChange={(e) =>
                                                setNewOrderForm({
                                                    ...newOrderForm,
                                                    customer: { ...newOrderForm.customer, phone: e.target.value }
                                                })
                                            }
                                            placeholder="Phone number"
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Email</label>
                                        <input
                                            type="email"
                                            className="admin-input"
                                            value={newOrderForm.customer.email}
                                            onChange={(e) =>
                                                setNewOrderForm({
                                                    ...newOrderForm,
                                                    customer: { ...newOrderForm.customer, email: e.target.value }
                                                })
                                            }
                                            placeholder="customer@example.com"
                                        />
                                    </div>

                                    <div className="admin-form-col-full admin-form-group">
                                        <label className="admin-label">Delivery Street Address</label>
                                        <input
                                            type="text"
                                            className="admin-input"
                                            value={newOrderForm.customer.address}
                                            onChange={(e) =>
                                                setNewOrderForm({
                                                    ...newOrderForm,
                                                    customer: { ...newOrderForm.customer, address: e.target.value }
                                                })
                                            }
                                            placeholder="Street address, apartment, etc."
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Select Botanical Item *</label>
                                        <select
                                            className="admin-select"
                                            value={newOrderForm.selectedProductId}
                                            onChange={(e) =>
                                                setNewOrderForm({
                                                    ...newOrderForm,
                                                    selectedProductId: e.target.value
                                                })
                                            }
                                        >
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} (Rs. {Number(p.price).toLocaleString()})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Quantity</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="admin-input"
                                            value={newOrderForm.quantity}
                                            onChange={(e) =>
                                                setNewOrderForm({
                                                    ...newOrderForm,
                                                    quantity: Number(e.target.value)
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Payment Method</label>
                                        <select
                                            className="admin-select"
                                            value={newOrderForm.paymentMethod}
                                            onChange={(e) =>
                                                setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value })
                                            }
                                        >
                                            <option value="cod">Cash on Delivery (COD)</option>
                                            <option value="card">Card Payment</option>
                                            <option value="bank">Bank Transfer</option>
                                        </select>
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-label">Initial Status</label>
                                        <select
                                            className="admin-select"
                                            value={newOrderForm.status}
                                            onChange={(e) =>
                                                setNewOrderForm({ ...newOrderForm, status: e.target.value })
                                            }
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setIsCreateModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    <Check size={16} />
                                    <span>Create Order</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE ORDER MODAL */}
            {orderToDelete && (
                <div className="admin-modal-backdrop" onClick={() => setOrderToDelete(null)}>
                    <div className="admin-modal" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title" style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <AlertTriangle size={20} />
                                <span>Delete Order</span>
                            </h2>
                            <button className="admin-icon-btn" onClick={() => setOrderToDelete(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <p>
                                Are you sure you want to delete order <strong>{orderToDelete.id}</strong>?
                            </p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setOrderToDelete(null)}>
                                Cancel
                            </button>
                            <button
                                className="admin-btn admin-btn-danger"
                                onClick={() => {
                                    deleteOrder(orderToDelete.id);
                                    setOrderToDelete(null);
                                }}
                            >
                                <Trash2 size={16} />
                                <span>Delete Permanently</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
