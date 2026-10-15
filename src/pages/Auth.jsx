import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    Leaf,
    User,
    Mail,
    Lock,
    Phone,
    MapPin,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Eye,
    EyeOff
} from "lucide-react";

export function Auth() {
    const { login, signup, currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Mode: "login" or "signup"
    const [mode, setMode] = useState("login");

    // Form inputs
    const [loginIdentifier, setLoginIdentifier] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [signupForm, setSignupForm] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        address: "",
        city: "Colombo",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // If already logged in, offer to redirect to account
    if (isAuthenticated) {
        return (
            <div className="container" style={{ padding: "5rem 1.5rem", maxWidth: "480px", textAlign: "center" }}>
                <div
                    style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--color-emerald-light)",
                        color: "var(--color-forest)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem"
                    }}
                >
                    <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                    Already Signed In
                </h2>
                <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem" }}>
                    You are signed in as <strong>{currentUser.name}</strong> ({currentUser.email}).
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <Link to="/" className="btn btn-primary">
                        Return to Home
                    </Link>
                    <Link to="/account" className="btn btn-outline">
                        View Profile &amp; Orders
                    </Link>
                </div>
            </div>
        );
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        setTimeout(() => {
            const res = login(loginIdentifier, loginPassword);
            setIsLoading(false);

            if (!res.success) {
                setErrorMessage(res.message);
            } else {
                setSuccessMessage("Signed in successfully! Redirecting to home...");
                setTimeout(() => {
                    const from = res.user.role === "admin" ? "/admin" : "/";
                    navigate(from, { replace: true });
                }, 500);
            }
        }, 350);
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (signupForm.password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        if (signupForm.password !== signupForm.confirmPassword) {
            setErrorMessage("Passwords do not match. Please re-enter.");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            const res = signup({
                name: signupForm.name,
                username: signupForm.username,
                email: signupForm.email,
                phone: signupForm.phone,
                address: signupForm.address,
                city: signupForm.city,
                password: signupForm.password
            });
            setIsLoading(false);

            if (!res.success) {
                setErrorMessage(res.message);
            } else {
                setSuccessMessage("Account created successfully! Redirecting to home...");
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 600);
            }
        }, 400);
    };


    return (
        <div style={{ backgroundColor: "var(--color-sand-light, #fcf9f5)", minHeight: "85vh", padding: "3rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
                className="admin-card"
                style={{
                    maxWidth: mode === "login" ? "440px" : "560px",
                    width: "100%",
                    padding: "2.5rem 2rem",
                    boxShadow: "var(--shadow-hover)",
                    border: "1px solid var(--color-border)",
                    transition: "max-width var(--transition-base)"
                }}
            >
                {/* Brand Header */}
                <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                    <div
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "var(--radius-md)",
                            background: "linear-gradient(135deg, var(--color-forest), var(--color-moss))",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1rem",
                            boxShadow: "0 6px 18px rgba(27, 56, 43, 0.2)"
                        }}
                    >
                        <Leaf size={26} />
                    </div>
                    <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text-main)", marginBottom: "0.25rem" }}>
                        {mode === "login" ? "Welcome Back" : "Join the Plant Club"}
                    </h1>
                    <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
                        {mode === "login"
                            ? "Sign in to manage your plant orders and care history"
                            : "Create an account for expedited checkout & tracking"}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div
                    style={{
                        display: "flex",
                        backgroundColor: "var(--color-emerald-ultra-light)",
                        borderRadius: "var(--radius-md)",
                        padding: "0.3rem",
                        marginBottom: "1.5rem",
                        border: "1px solid var(--color-border-subtle)"
                    }}
                >
                    <button
                        type="button"
                        onClick={() => {
                            setMode("login");
                            setErrorMessage("");
                        }}
                        style={{
                            flex: 1,
                            padding: "0.6rem",
                            borderRadius: "var(--radius-sm)",
                            border: "none",
                            background: mode === "login" ? "var(--color-surface)" : "transparent",
                            color: mode === "login" ? "var(--color-forest)" : "var(--color-text-muted)",
                            fontWeight: mode === "login" ? 700 : 500,
                            boxShadow: mode === "login" ? "var(--shadow-xs)" : "none",
                            cursor: "pointer",
                            fontSize: "0.88rem",
                            transition: "all var(--transition-fast)"
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMode("signup");
                            setErrorMessage("");
                        }}
                        style={{
                            flex: 1,
                            padding: "0.6rem",
                            borderRadius: "var(--radius-sm)",
                            border: "none",
                            background: mode === "signup" ? "var(--color-surface)" : "transparent",
                            color: mode === "signup" ? "var(--color-forest)" : "var(--color-text-muted)",
                            fontWeight: mode === "signup" ? 700 : 500,
                            boxShadow: mode === "signup" ? "var(--shadow-xs)" : "none",
                            cursor: "pointer",
                            fontSize: "0.88rem",
                            transition: "all var(--transition-fast)"
                        }}
                    >
                        Create Account
                    </button>
                </div>

                {/* Alert Messages */}
                {errorMessage && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.5rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "#fee2e2",
                            color: "#b91c1c",
                            fontSize: "0.85rem",
                            marginBottom: "1.25rem"
                        }}
                    >
                        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {successMessage && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "var(--radius-md)",
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            fontSize: "0.85rem",
                            marginBottom: "1.25rem"
                        }}
                    >
                        <CheckCircle2 size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* SIGN IN FORM */}
                {mode === "login" ? (
                    <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                        <div className="admin-form-group">
                            <label className="admin-label">Username or Email *</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type="text"
                                    className="admin-input"
                                    required
                                    style={{ width: "100%", paddingLeft: "2.3rem" }}
                                    value={loginIdentifier}
                                    onChange={(e) => setLoginIdentifier(e.target.value)}
                                    placeholder="Username or email address"
                                />
                                <User
                                    size={16}
                                    style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}
                                />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-label">Password *</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="admin-input"
                                    required
                                    style={{ width: "100%", paddingLeft: "2.3rem", paddingRight: "2.5rem" }}
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="Enter your account password"
                                />
                                <Lock
                                    size={16}
                                    style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}
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
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={isLoading}
                            style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", marginTop: "0.5rem" }}
                        >
                            <span>{isLoading ? "Signing in..." : "Sign In to Account"}</span>
                            <ArrowRight size={16} />
                        </button>
                    </form>
                ) : (
                    /* SIGN UP FORM */
                    <form onSubmit={handleSignupSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div className="admin-form-grid">
                            <div className="admin-form-group">
                                <label className="admin-label">Full Name *</label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    required
                                    value={signupForm.name}
                                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Choose Username *</label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    required
                                    value={signupForm.username}
                                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                                    placeholder="Unique username"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Email Address *</label>
                                <input
                                    type="email"
                                    className="admin-input"
                                    required
                                    value={signupForm.email}
                                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Contact Phone</label>
                                <input
                                    type="tel"
                                    className="admin-input"
                                    value={signupForm.phone}
                                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                                    placeholder="Phone number"
                                />
                            </div>

                            <div className="admin-form-col-full admin-form-group">
                                <label className="admin-label">Delivery Street Address</label>
                                <input
                                    type="text"
                                    className="admin-input"
                                    value={signupForm.address}
                                    onChange={(e) => setSignupForm({ ...signupForm, address: e.target.value })}
                                    placeholder="45/2 Lotus Grove, Havelock Road"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Password * (min. 6 characters)</label>
                                <input
                                    type="password"
                                    className="admin-input"
                                    required
                                    value={signupForm.password}
                                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                    placeholder="Create secure password"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Confirm Password *</label>
                                <input
                                    type="password"
                                    className="admin-input"
                                    required
                                    value={signupForm.confirmPassword}
                                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                                    placeholder="Re-enter password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={isLoading}
                            style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", marginTop: "0.5rem" }}
                        >
                            <span>{isLoading ? "Creating Account..." : "Register Account"}</span>
                            <ArrowRight size={16} />
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}

export default Auth;
