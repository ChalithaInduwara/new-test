import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { initializeCleanSlate } from "./utils/cleanSlate";

// Purge any pre-entered demo records and cached images from previous sessions
initializeCleanSlate();

import App from "./App.jsx";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";

import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/shop.css";
import "./styles/cart.css";
import "./styles/responsive.css";
import "./styles/admin.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ThemeProvider>
                <AuthProvider>
                    <StoreProvider>
                        <ProductProvider>
                            <CartProvider>
                                <App />
                            </CartProvider>
                        </ProductProvider>
                    </StoreProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);