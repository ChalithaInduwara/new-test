import React from "react";
import { useProducts } from "../../context/ProductContext";
import { useStore } from "../../context/StoreContext";
import {
    TrendingUp,
    Package,
    ShoppingBag,
    MessageSquare,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Plus,
    ArrowUpRight,
    Tag,
    ChevronRight,
    Leaf
} from "lucide-react";

export function AdminDashboard({ setActiveTab }) {
    const { products, adjustProductStock } = useProducts();
    const { orders, messages, coupons, updateOrderStatus } = useStore();

    // Calculate analytics
    const validOrders = orders.filter((o) => o.status !== "Cancelled");
    const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
    const processingOrdersCount = orders.filter((o) => o.status === "Processing").length;
    const unreadMessagesCount = messages.filter((m) => m.status === "unread").length;
    const lowStockProducts = products.filter((p) => (p.stockCount ?? 0) <= 5);
    const outOfStockProducts = products.filter((p) => (p.stockCount ?? 0) === 0 || !p.inStock);

    const recentOrders = orders.slice(0, 5);

    const getStatusBadge = (status) => {
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

    return (
        <div className="admin-dashboard-view">
            {/* Top KPI Cards */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div>
                        <div className="admin-stat-label">Total Revenue</div>
                        <div className="admin-stat-val">Rs. {totalRevenue.toLocaleString()}</div>
                        <div className="admin-stat-meta">
                            <TrendingUp size={14} color="#2e7d32" />
                            <span>Across {validOrders.length} active orders</span>
                        </div>
                    </div>
                    <div className="admin-stat-icon-wrap icon-revenue">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="admin-stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("orders")}>
                    <div>
                        <div className="admin-stat-label">Total Orders</div>
                        <div className="admin-stat-val">{orders.length}</div>
                        <div className="admin-stat-meta">
                            <Clock size={14} color="#f57f17" />
                            <span>{pendingOrdersCount} pending • {processingOrdersCount} processing</span>
                        </div>
                    </div>
                    <div className="admin-stat-icon-wrap icon-orders">
                        <ShoppingBag size={24} />
                    </div>
                </div>

                <div className="admin-stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("products")}>
                    <div>
                        <div className="admin-stat-label">Catalog Products</div>
                        <div className="admin-stat-val">{products.length}</div>
                        <div className="admin-stat-meta">
                            {lowStockProducts.length > 0 ? (
                                <>
                                    <AlertTriangle size={14} color="#d97706" />
                                    <span style={{ color: "#d97706", fontWeight: 600 }}>
                                        {lowStockProducts.length} low stock items
                                    </span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={14} color="#2e7d32" />
                                    <span>All items well stocked</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="admin-stat-icon-wrap icon-products">
                        <Package size={24} />
                    </div>
                </div>

                <div className="admin-stat-card" style={{ cursor: "pointer" }} onClick={() => setActiveTab("messages")}>
                    <div>
                        <div className="admin-stat-label">Customer Inquiries</div>
                        <div className="admin-stat-val">{messages.length}</div>
                        <div className="admin-stat-meta">
                            <MessageSquare size={14} color="#c2185b" />
                            <span>{unreadMessagesCount} unread messages</span>
                        </div>
                    </div>
                    <div className="admin-stat-icon-wrap icon-messages">
                        <MessageSquare size={24} />
                    </div>
                </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setActiveTab("products")}
                >
                    <Plus size={16} />
                    <span>Manage &amp; Add Products</span>
                </button>
                <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setActiveTab("orders")}
                >
                    <ShoppingBag size={16} />
                    <span>View Orders ({pendingOrdersCount} new)</span>
                </button>
                <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setActiveTab("coupons")}
                >
                    <Tag size={16} />
                    <span>Promo Discounts ({coupons.length})</span>
                </button>
                <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => setActiveTab("settings")}
                >
                    <Leaf size={16} />
                    <span>Store Announcement &amp; Shipping</span>
                </button>
            </div>

            {/* 2-Column Split: Recent Orders & Inventory Alerts */}
            <div className="dashboard-grid-2">
                {/* Recent Orders Card */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-title">
                            <ShoppingBag size={18} />
                            <span>Recent Store Orders</span>
                        </div>
                        <button
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() => setActiveTab("orders")}
                        >
                            <span>View All</span>
                            <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Quick Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td style={{ fontWeight: 700, color: "var(--color-forest)" }}>
                                            {order.id}
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>
                                                {order.customer?.firstName} {order.customer?.lastName}
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                                                {order.customer?.city}
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: "0.85rem" }}>
                                                {order.items?.length || 1} item{order.items?.length > 1 ? "s" : ""}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>
                                            Rs. {Number(order.total || 0).toLocaleString()}
                                        </td>
                                        <td>{getStatusBadge(order.status)}</td>
                                        <td>
                                            <select
                                                className="admin-select"
                                                style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stock Warning & Nursery Alerts */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div className="admin-card-title">
                            <AlertTriangle size={18} color="#d97706" />
                            <span>Stock Watchlist</span>
                        </div>
                        <span className="badge-chip badge-warning">{lowStockProducts.length} Alert</span>
                    </div>

                    <div className="admin-card-body" style={{ padding: "1rem" }}>
                        {lowStockProducts.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--color-text-muted)" }}>
                                <CheckCircle2 size={32} color="#2e7d32" style={{ margin: "0 auto 0.5rem" }} />
                                <p style={{ fontWeight: 600 }}>All nursery stock levels healthy!</p>
                                <p style={{ fontSize: "0.8rem" }}>No items below 5 units.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                {lowStockProducts.map((p) => (
                                    <div
                                        key={p.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "0.65rem 0.85rem",
                                            borderRadius: "var(--radius-md)",
                                            backgroundColor: "var(--color-emerald-ultra-light)"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
                                            />
                                            <div>
                                                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{p.name}</div>
                                                <div style={{ fontSize: "0.75rem", color: p.stockCount === 0 ? "#dc2626" : "#d97706", fontWeight: 700 }}>
                                                    {p.stockCount === 0 ? "OUT OF STOCK" : `Only ${p.stockCount} left`}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            className="admin-btn admin-btn-secondary admin-btn-sm"
                                            onClick={() => adjustProductStock(p.id, 10)}
                                            title="Add 10 to inventory"
                                        >
                                            <span>+10 Restock</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border-subtle)" }}>
                            <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                                Quick Catalog Breakdown
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                                <span>Active Products</span>
                                <strong>{products.filter((p) => p.inStock).length}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginTop: "0.25rem" }}>
                                <span>Out of Stock</span>
                                <strong style={{ color: outOfStockProducts.length > 0 ? "#dc2626" : "inherit" }}>
                                    {outOfStockProducts.length}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
