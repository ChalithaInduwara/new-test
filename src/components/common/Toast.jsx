import React from "react";
import { useCart } from "../../context/CartContext";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function Toast() {
    const { toast } = useCart();

    if (!toast) return null;

    const isError = toast.type === "error";

    return (
        <div className={`floating-toast ${isError ? "toast-error" : "toast-success"}`}>
            <div className="toast-icon">
                {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <span className="toast-text">{toast.message}</span>
        </div>
    );
}

export default Toast;
