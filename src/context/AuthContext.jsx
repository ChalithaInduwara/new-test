import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const STORAGE_KEYS = {
    USERS: "leaf_clay_users_v2",
    CURRENT_USER: "leaf_clay_current_user_v2",
    ADMIN_AUTH: "leaf_clay_admin_auth_v2"
};

// Default seed users (Admin + Demo Customer)
const INITIAL_USERS = [
    {
        id: "usr-admin",
        name: "Botanical Store Administrator",
        username: "admin",
        email: "admin@leafandclay.lk",
        password: "admin123",
        role: "admin",
        phone: "+94 (11) 234-5678",
        address: "No. 42 Botanical Gardens Road",
        city: "Colombo 07"
    },
    {
        id: "usr-customer-1",
        name: "Dilshan Perera",
        username: "dilshan",
        email: "dilshan.perera@example.com",
        password: "customer123",
        role: "customer",
        phone: "+94 77 123 4567",
        address: "45/2 Lotus Grove, Havelock Road",
        city: "Colombo 05",
        postalCode: "00500"
    }
];

export function AuthProvider({ children }) {
    // -------------------------------------------------------------------------
    // Users database in localStorage
    // -------------------------------------------------------------------------
    const [users, setUsers] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.USERS);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure admin always exists in users
                const hasAdmin = parsed.some((u) => u.username === "admin");
                if (!hasAdmin) {
                    return [...INITIAL_USERS, ...parsed];
                }
                return parsed;
            }
            return INITIAL_USERS;
        } catch {
            return INITIAL_USERS;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        } catch (e) {
            console.error("Failed to save users to localStorage", e);
        }
    }, [users]);

    // -------------------------------------------------------------------------
    // Current Logged-in User (Customer or Admin)
    // -------------------------------------------------------------------------
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        try {
            if (currentUser) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
            } else {
                localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            }
        } catch (e) {
            console.error("Failed to sync currentUser to localStorage", e);
        }
    }, [currentUser]);

    // -------------------------------------------------------------------------
    // Admin Session Authenticated State (Strictly required for Admin Panel)
    // -------------------------------------------------------------------------
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
            return saved === "true";
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            if (isAdminAuthenticated) {
                localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
            } else {
                localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
            }
        } catch (e) {
            console.error("Failed to sync admin auth", e);
        }
    }, [isAdminAuthenticated]);

    // =========================================================================
    // AUTH METHODS
    // =========================================================================

    // Customer or Admin General Login
    const login = (usernameOrEmail, password) => {
        const cleanIdentifier = usernameOrEmail.trim().toLowerCase();
        const user = users.find(
            (u) =>
                u.username.toLowerCase() === cleanIdentifier ||
                u.email.toLowerCase() === cleanIdentifier
        );

        if (!user) {
            return { success: false, message: "No account found with this username or email." };
        }

        if (user.password !== password) {
            return { success: false, message: "Incorrect password. Please try again." };
        }

        setCurrentUser(user);
        if (user.role === "admin") {
            setIsAdminAuthenticated(true);
        }

        return { success: true, user };
    };

    // Dedicated Admin Login with username and password
    const adminLogin = (username, password) => {
        const cleanUser = username.trim().toLowerCase();
        const user = users.find(
            (u) =>
                (u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser) &&
                u.role === "admin"
        );

        if (!user) {
            return { success: false, message: "Admin account not found. Invalid administrator username." };
        }

        if (user.password !== password) {
            return { success: false, message: "Incorrect administrator password. Access denied." };
        }

        setCurrentUser(user);
        setIsAdminAuthenticated(true);
        return { success: true, user };
    };

    // Customer Sign Up
    const signup = (userData) => {
        const cleanEmail = userData.email.trim().toLowerCase();
        const cleanUsername = (userData.username || userData.email.split("@")[0])
            .trim()
            .toLowerCase();

        // Check if email or username already taken
        const emailExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
        if (emailExists) {
            return { success: false, message: "An account with this email address already exists." };
        }

        const usernameExists = users.some((u) => u.username.toLowerCase() === cleanUsername);
        if (usernameExists) {
            return { success: false, message: "This username is already taken. Please choose another." };
        }

        const newUser = {
            id: `usr-${Date.now()}`,
            name: userData.name || cleanUsername,
            username: cleanUsername,
            email: cleanEmail,
            password: userData.password,
            role: "customer",
            phone: userData.phone || "",
            address: userData.address || "",
            city: userData.city || "Colombo",
            postalCode: userData.postalCode || ""
        };

        setUsers((prev) => [...prev, newUser]);
        setCurrentUser(newUser);

        return { success: true, user: newUser };
    };

    // Log out (Customer and/or Admin)
    const logout = () => {
        setCurrentUser(null);
        setIsAdminAuthenticated(false);
    };

    // Lock / Log out Admin Only
    const adminLogout = () => {
        setIsAdminAuthenticated(false);
        if (currentUser?.role === "admin") {
            setCurrentUser(null);
        }
    };

    // Update Profile Information
    const updateProfile = (updatedFields) => {
        if (!currentUser) return;

        const updated = { ...currentUser, ...updatedFields };
        setCurrentUser(updated);

        setUsers((prev) =>
            prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedFields } : u))
        );

        return { success: true, user: updated };
    };

    return (
        <AuthContext.Provider
            value={{
                users,
                currentUser,
                isAdmin: currentUser?.role === "admin",
                isAuthenticated: !!currentUser,
                isAdminAuthenticated,
                login,
                adminLogin,
                signup,
                logout,
                adminLogout,
                updateProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
