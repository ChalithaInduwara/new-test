import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import {
    MessageSquare,
    Search,
    Eye,
    Trash2,
    X,
    Check,
    Mail,
    Calendar,
    User,
    CheckCircle2,
    AlertTriangle,
    Save
} from "lucide-react";

export function AdminMessages() {
    const { messages, updateMessage, markMessageStatus, deleteMessage } = useStore();

    const [filterStatus, setFilterStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [msgToDelete, setMsgToDelete] = useState(null);
    const [replyNote, setReplyNote] = useState("");

    const filteredMessages = messages.filter((msg) => {
        const matchesStatus =
            filterStatus === "all" || msg.status?.toLowerCase() === filterStatus.toLowerCase();

        const searchLower = search.toLowerCase();
        const matchesSearch =
            search.trim() === "" ||
            msg.name?.toLowerCase().includes(searchLower) ||
            msg.email?.toLowerCase().includes(searchLower) ||
            msg.message?.toLowerCase().includes(searchLower) ||
            msg.subject?.toLowerCase().includes(searchLower);

        return matchesStatus && matchesSearch;
    });

    const openViewModal = (msg) => {
        setSelectedMsg(msg);
        setReplyNote(msg.replyNote || "");
        if (msg.status === "unread") {
            markMessageStatus(msg.id, "read");
        }
    };

    const handleSaveReply = (e) => {
        e.preventDefault();
        if (selectedMsg) {
            updateMessage(selectedMsg.id, {
                replyNote,
                status: replyNote.trim() ? "replied" : selectedMsg.status
            });
            setSelectedMsg(null);
        }
    };

    const counts = {
        all: messages.length,
        unread: messages.filter((m) => m.status === "unread").length,
        read: messages.filter((m) => m.status === "read").length,
        replied: messages.filter((m) => m.status === "replied").length
    };

    return (
        <div className="admin-messages-view">
            <div className="admin-toolbar">
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                    <div className="admin-search-box">
                        <Search size={16} color="var(--color-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search messages by name, email, keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "0.35rem" }}>
                        {["all", "unread", "read", "replied"].map((st) => (
                            <button
                                key={st}
                                className={`admin-btn admin-btn-sm ${filterStatus === st ? "admin-btn-primary" : "admin-btn-secondary"}`}
                                onClick={() => setFilterStatus(st)}
                                style={{ textTransform: "capitalize" }}
                            >
                                <span>{st}</span>
                                <span style={{ opacity: 0.8, fontSize: "0.72rem" }}>({counts[st] || 0})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th>Topic / Subject</th>
                                <th>Message Excerpt</th>
                                <th>Received</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-muted)" }}>
                                        No customer messages or inquiries matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => {
                                    const isUnread = msg.status === "unread";
                                    const dateStr = new Date(msg.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric"
                                    });

                                    return (
                                        <tr key={msg.id} style={{ fontWeight: isUnread ? 700 : "normal" }}>
                                            <td>
                                                <div style={{ color: "var(--color-text-main)" }}>{msg.name}</div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: "normal" }}>
                                                    {msg.email}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="badge-chip badge-neutral" style={{ textTransform: "capitalize" }}>
                                                    {msg.subject || "care"}
                                                </span>
                                            </td>

                                            <td style={{ maxWidth: "340px" }}>
                                                <div
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        fontSize: "0.85rem",
                                                        color: isUnread ? "var(--color-text-main)" : "var(--color-text-muted)"
                                                    }}
                                                >
                                                    {msg.message}
                                                </div>
                                            </td>

                                            <td style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                                                {dateStr}
                                            </td>

                                            <td>
                                                {msg.status === "unread" ? (
                                                    <span className="badge-chip badge-warning">Unread</span>
                                                ) : msg.status === "replied" ? (
                                                    <span className="badge-chip status-delivered">Replied</span>
                                                ) : (
                                                    <span className="badge-chip badge-neutral">Read</span>
                                                )}
                                            </td>

                                            <td>
                                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem" }}>
                                                    <button
                                                        className="admin-icon-btn"
                                                        onClick={() => openViewModal(msg)}
                                                        title="Read & Reply"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        className="admin-icon-btn"
                                                        style={{ color: "#dc2626" }}
                                                        onClick={() => setMsgToDelete(msg)}
                                                        title="Delete Inquiry"
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

            {/* MESSAGE DETAILS MODAL */}
            {selectedMsg && (
                <div className="admin-modal-backdrop" onClick={() => setSelectedMsg(null)}>
                    <div className="admin-modal" style={{ maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <div>
                                <h2 className="admin-modal-title">Customer Care Inquiry</h2>
                                <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                                    Received {new Date(selectedMsg.date).toLocaleString()}
                                </span>
                            </div>
                            <button className="admin-icon-btn" onClick={() => setSelectedMsg(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveReply}>
                            <div className="admin-modal-body">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", padding: "0.85rem", backgroundColor: "var(--color-emerald-ultra-light)", borderRadius: "var(--radius-md)" }}>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{selectedMsg.name}</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                                            {selectedMsg.email}
                                        </div>
                                    </div>
                                    <a
                                        href={`mailto:${selectedMsg.email}?subject=Re: Leaf %26 Clay Inquiry - ${selectedMsg.subject}`}
                                        className="admin-btn admin-btn-primary admin-btn-sm"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Mail size={14} />
                                        <span>Send Email</span>
                                    </a>
                                </div>

                                <div style={{ marginBottom: "1.25rem" }}>
                                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.35rem" }}>
                                        Subject / Topic
                                    </div>
                                    <span className="badge-chip badge-neutral" style={{ textTransform: "capitalize", fontSize: "0.85rem" }}>
                                        {selectedMsg.subject}
                                    </span>
                                </div>

                                <div style={{ marginBottom: "1.5rem" }}>
                                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.35rem" }}>
                                        Customer Message
                                    </div>
                                    <div style={{ padding: "1rem", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", lineHeight: 1.6, fontSize: "0.92rem" }}>
                                        {selectedMsg.message}
                                    </div>
                                </div>

                                <div className="admin-form-group">
                                    <label className="admin-label">Internal Nursery Staff Reply Notes</label>
                                    <textarea
                                        className="admin-textarea"
                                        value={replyNote}
                                        onChange={(e) => setReplyNote(e.target.value)}
                                        placeholder="Record steps taken, plant care advice sent, or resolution notes..."
                                    />
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={() => setSelectedMsg(null)}
                                >
                                    Close
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    <Save size={16} />
                                    <span>Save Notes &amp; Mark Replied</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MESSAGE CONFIRMATION */}
            {msgToDelete && (
                <div className="admin-modal-backdrop" onClick={() => setMsgToDelete(null)}>
                    <div className="admin-modal" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title" style={{ color: "#dc2626", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <AlertTriangle size={20} />
                                <span>Delete Inquiry</span>
                            </h2>
                            <button className="admin-icon-btn" onClick={() => setMsgToDelete(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <p>
                                Are you sure you want to delete inquiry from <strong>{msgToDelete.name}</strong>?
                            </p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="admin-btn admin-btn-secondary" onClick={() => setMsgToDelete(null)}>
                                Cancel
                            </button>
                            <button
                                className="admin-btn admin-btn-danger"
                                onClick={() => {
                                    deleteMessage(msgToDelete.id);
                                    setMsgToDelete(null);
                                }}
                            >
                                <Trash2 size={16} />
                                <span>Delete Inquiry</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
